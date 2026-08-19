// Assessment API Route - Submit answers, get results, scoring
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assessments, assessmentAnswers, riskResults, recommendations, roadmapItems, kpis } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { resolveOrgId } from "@/lib/access";
import { assessmentQuestions, categories } from "@/lib/assessment-questions";
import { calculateQuestionRisk, calculateAnswerScore, calculateCategoryScores, calculateOverallResult, getMaturityLevel } from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";
import { defaultRoadmapItems } from "@/lib/default-data";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const action = request.nextUrl.searchParams.get("action");

    if (action === "questions") {
      return NextResponse.json({ questions: assessmentQuestions, categories });
    }

    if (action === "results") {
      const requestedOrgId = request.nextUrl.searchParams.get("orgId");
      const orgId = resolveOrgId(session, requestedOrgId);
      if (requestedOrgId && !orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });

      // Get latest assessment
      const assessResults = await db.query.assessments.findMany({
        where: eq(assessments.organizationId, orgId),
        orderBy: (a, { desc }) => [desc(a.createdAt)],
        limit: 1,
      });

      if (assessResults.length === 0) {
        return NextResponse.json({ assessment: null, answers: [], categoryScores: [], overallResult: null });
      }

      const assessment = assessResults[0];
      const answers = await db.query.assessmentAnswers.findMany({
        where: eq(assessmentAnswers.assessmentId, assessment.id),
      });

      const riskResultsData = await db.query.riskResults.findMany({
        where: eq(riskResults.assessmentId, assessment.id),
      });

      const recs = await db.query.recommendations.findMany({
        where: eq(recommendations.organizationId, orgId),
      });

      return NextResponse.json({
        assessment,
        answers,
        riskResults: riskResultsData,
        recommendations: recs,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Assessment GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, orgId, answers: submittedAnswers } = body;

    const organizationId = resolveOrgId(session, orgId);
    if (orgId && !organizationId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

    if (action === "submit") {
      if (!submittedAnswers || typeof submittedAnswers !== "object") {
        return NextResponse.json({ error: "Answers object required" }, { status: 400 });
      }

      // Create assessment record
      const assessResult = await db.insert(assessments).values({
        organizationId,
        status: "completed",
      }).returning();

      const assessment = assessResult[0];

      // Process each answer
      const answerRecords: { questionId: string; category: string; answer: string; score: number; riskScore: number; riskLevel: string }[] = [];

      for (const [questionId, answer] of Object.entries(submittedAnswers as Record<string, string>)) {
        const question = assessmentQuestions.find((q) => q.id === questionId);
        if (!question) continue;

        const risk = calculateQuestionRisk(answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable", question.likelihood, question.impact);
        const score = calculateAnswerScore(answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable");

        await db.insert(assessmentAnswers).values({
          assessmentId: assessment.id,
          questionId,
          category: question.category,
          questionText: question.question,
          answer: answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable",
          score: score >= 0 ? score : 0,
          likelihood: risk.likelihood,
          impact: risk.impact,
          riskScore: risk.riskScore,
          riskLevel: risk.riskLevel,
        });

        answerRecords.push({
          questionId,
          category: question.category,
          answer,
          score: score >= 0 ? score : 0,
          riskScore: risk.riskScore,
          riskLevel: risk.riskLevel,
        });
      }

      // Calculate category scores
      const catScores = calculateCategoryScores(
        answerRecords.map((a) => ({
          questionId: a.questionId,
          category: a.category,
          answer: a.answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable",
        }))
      );

      // Save category risk results
      for (const cs of catScores) {
        await db.insert(riskResults).values({
          assessmentId: assessment.id,
          category: cs.category,
          categoryScore: cs.score,
          riskScore: cs.score > 0 ? 100 - cs.score : 0,
          riskLevel: cs.riskLevel,
        });
      }

      // Calculate overall result
      const overall = calculateOverallResult(
        answerRecords.map((a) => ({
          questionId: a.questionId,
          category: a.category,
          answer: a.answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable",
        })),
        assessmentQuestions.length
      );

      // Update assessment with scores
      await db.update(assessments).set({
        overallScore: overall.overallScore,
        riskLevel: overall.riskLevel,
        maturityLevel: overall.maturityLevel,
      }).where(eq(assessments.id, assessment.id));

      // Generate and save recommendations
      const recs = generateRecommendations(submittedAnswers as Record<string, "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable">);

      // Clear old recommendations for this org
      // We'll just insert new ones (old ones remain for history)

      for (const rec of recs.slice(0, 30)) { // Limit to top 30
        await db.insert(recommendations).values({
          assessmentId: assessment.id,
          organizationId,
          title: rec.title,
          description: rec.description,
          category: rec.category,
          priority: rec.priority,
          costEstimate: rec.costEstimate,
          implementationTime: rec.implementationTime,
          risk: rec.risk,
          businessImpact: rec.businessImpact,
          implementationEffort: rec.implementationEffort,
        });
      }

      // Create roadmap items if not exist
      const existingRoadmap = await db.query.roadmapItems.findMany({
        where: eq(roadmapItems.organizationId, organizationId),
      });

      if (existingRoadmap.length === 0) {
        for (const item of defaultRoadmapItems) {
          await db.insert(roadmapItems).values({
            organizationId,
            title: item.title,
            description: item.description,
            phase: item.phase,
            category: item.category,
            status: "not_started",
          });
        }
      }

      // Update KPIs based on assessment
      const existingKPIs = await db.query.kpis.findMany({
        where: eq(kpis.organizationId, organizationId),
      });

      if (existingKPIs.length === 0) {
        // Calculate initial KPI values from assessment
        const mfaAnswer = submittedAnswers["iam_1"] || submittedAnswers["email_1"];
        const mfaValue = mfaAnswer === "fully_implemented" ? 100 : mfaAnswer === "partially_implemented" ? 45 : 0;
        const patchAnswer = submittedAnswers["ep_1"];
        const patchValue = patchAnswer === "fully_implemented" ? 95 : patchAnswer === "partially_implemented" ? 60 : 20;
        const backupAnswer = submittedAnswers["bdr_1"];
        const backupValue = backupAnswer === "fully_implemented" ? 100 : backupAnswer === "partially_implemented" ? 50 : 0;
        const trainAnswer = submittedAnswers["aware_1"];
        const trainValue = trainAnswer === "fully_implemented" ? 100 : trainAnswer === "partially_implemented" ? 40 : 0;

        const kpiData = [
          { name: "MFA Coverage", currentValue: mfaValue, targetValue: 100, unit: "%", category: "Identity & Access Management" },
          { name: "Patch Compliance", currentValue: patchValue, targetValue: 95, unit: "%", category: "Vulnerability Management" },
          { name: "Backup Success Rate", currentValue: backupValue, targetValue: 100, unit: "%", category: "Backup & Disaster Recovery" },
          { name: "Employee Training Completion", currentValue: trainValue, targetValue: 100, unit: "%", category: "Employee Security Awareness" },
          { name: "Phishing Click Rate", currentValue: 15, targetValue: 3, unit: "%", category: "Employee Security Awareness" },
          { name: "Critical Vulnerabilities", currentValue: overall.riskDistribution.critical, targetValue: 0, unit: "count", category: "Vulnerability Management" },
          { name: "Open Security Gaps", currentValue: answerRecords.filter((a) => a.answer !== "fully_implemented" && a.answer !== "not_applicable").length, targetValue: 0, unit: "count", category: "Security Policies" },
          { name: "Completed Recommendations", currentValue: 0, targetValue: recs.length, unit: "%", category: "Security Policies" },
        ];

        for (const kpi of kpiData) {
          await db.insert(kpis).values({
            organizationId,
            name: kpi.name,
            currentValue: kpi.currentValue,
            targetValue: kpi.targetValue,
            unit: kpi.unit,
            category: kpi.category,
          });
        }
      } else {
        // Update existing KPIs
        const mfaAnswer = submittedAnswers["iam_1"] || submittedAnswers["email_1"];
        const mfaValue = mfaAnswer === "fully_implemented" ? 100 : mfaAnswer === "partially_implemented" ? 45 : 0;
        const patchAnswer = submittedAnswers["ep_1"];
        const patchValue = patchAnswer === "fully_implemented" ? 95 : patchAnswer === "partially_implemented" ? 60 : 20;
        const backupAnswer = submittedAnswers["bdr_1"];
        const backupValue = backupAnswer === "fully_implemented" ? 100 : backupAnswer === "partially_implemented" ? 50 : 0;
        const trainAnswer = submittedAnswers["aware_1"];
        const trainValue = trainAnswer === "fully_implemented" ? 100 : trainAnswer === "partially_implemented" ? 40 : 0;

        for (const kpi of existingKPIs) {
          let newValue = kpi.currentValue;
          if (kpi.name === "MFA Coverage") newValue = mfaValue;
          else if (kpi.name === "Patch Compliance") newValue = patchValue;
          else if (kpi.name === "Backup Success Rate") newValue = backupValue;
          else if (kpi.name === "Employee Training Completion") newValue = trainValue;
          else if (kpi.name === "Critical Vulnerabilities") newValue = overall.riskDistribution.critical;
          else if (kpi.name === "Open Security Gaps") newValue = answerRecords.filter((a) => a.answer !== "fully_implemented" && a.answer !== "not_applicable").length;

          await db.update(kpis).set({ currentValue: newValue }).where(eq(kpis.id, kpi.id));
        }
      }

      return NextResponse.json({
        success: true,
        assessment: { ...assessment, overallScore: overall.overallScore, riskLevel: overall.riskLevel, maturityLevel: overall.maturityLevel },
        overallResult: overall,
        categoryScores: catScores,
        recommendationsCount: recs.length,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Assessment POST error:", error);
    return NextResponse.json({ error: "Failed to process assessment" }, { status: 500 });
  }
}
