// Seed API Route - Initialize demo data
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, organizations, assessments, assessmentAnswers, riskResults, recommendations, roadmapItems, incidents, securityPolicies, kpis } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { assessmentQuestions } from "@/lib/assessment-questions";
import { calculateQuestionRisk, calculateAnswerScore, calculateCategoryScores, calculateOverallResult } from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";
import { defaultRoadmapItems, policyTemplates, defaultKPIs } from "@/lib/default-data";

export async function POST(request: NextRequest) {
  try {
    // Check if demo data already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.username, "admin"),
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Demo data already exists", skipped: true });
    }

    // ===== Create System Admin =====
    const adminHash = await hashPassword("Admin@123");
    await db.insert(users).values({
      username: "admin",
      email: "admin@cybershield.org",
      passwordHash: adminHash,
      role: "sys_admin",
    });

    // ===== Create Demo Organization =====
    const orgResult = await db.insert(organizations).values({
      name: "Helping Hands Foundation",
      type: "Non-Governmental Organization (NGO)",
      numEmployees: 35,
      numVolunteers: 80,
      numLocations: 2,
      annualItBudget: 500000,
      itStaffCount: 1,
      usesCloudServices: true,
      usesOnlineBanking: true,
      storesDonorData: true,
      storesBeneficiaryData: true,
      storesEmployeeData: true,
      usesThirdPartyVendors: true,
    }).returning();

    const org = orgResult[0];

    // ===== Create NGO Admin User =====
    const ngoHash = await hashPassword("Ngo@123");
    const ngoUserResult = await db.insert(users).values({
      username: "ngo_admin",
      email: "admin@helpinghands.org",
      passwordHash: ngoHash,
      role: "ngo_admin",
      organizationId: org.id,
    }).returning();

    // ===== Create Demo Assessment with Realistic Weaknesses =====
    const demoAnswers: Record<string, "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable"> = {
      // IAM - MFA partial, passwords basic, no password manager
      iam_1: "partially_implemented",
      iam_2: "partially_implemented",
      iam_3: "partially_implemented",
      iam_4: "not_implemented",
      iam_5: "not_implemented",
      iam_6: "not_implemented",
      iam_7: "partially_implemented",
      // Endpoint - partial patching, basic AV, no encryption
      ep_1: "partially_implemented",
      ep_2: "partially_implemented",
      ep_3: "partially_implemented",
      ep_4: "not_implemented",
      ep_5: "not_implemented",
      ep_6: "not_implemented",
      // Network - basic firewall, wifi partial, no VPN
      net_1: "partially_implemented",
      net_2: "partially_implemented",
      net_3: "not_implemented",
      net_4: "not_implemented",
      net_5: "partially_implemented",
      // Data Protection - partial classification, no encryption, partial access
      dp_1: "not_implemented",
      dp_2: "partially_implemented",
      dp_3: "partially_implemented",
      dp_4: "not_implemented",
      dp_5: "not_implemented",
      dp_6: "not_implemented",
      // Backup - partial, not automated, no offsite, not tested
      bdr_1: "partially_implemented",
      bdr_2: "not_implemented",
      bdr_3: "not_implemented",
      bdr_4: "not_implemented",
      bdr_5: "not_implemented",
      bdr_6: "not_implemented",
      // Email - MFA partial, spam basic, no training, no SPF/DKIM/DMARC
      email_1: "partially_implemented",
      email_2: "partially_implemented",
      email_3: "not_implemented",
      email_4: "not_implemented",
      email_5: "not_implemented",
      email_6: "not_implemented",
      // Awareness - no training, no simulations, no reporting
      aware_1: "not_implemented",
      aware_2: "not_implemented",
      aware_3: "not_implemented",
      aware_4: "not_implemented",
      aware_5: "not_implemented",
      // Incident Response - no plan, no process
      ir_1: "not_implemented",
      ir_2: "not_implemented",
      ir_3: "not_implemented",
      ir_4: "not_implemented",
      ir_5: "not_implemented",
      // Policies - partial, not comprehensive
      sp_1: "partially_implemented",
      sp_2: "not_implemented",
      sp_3: "partially_implemented",
      sp_4: "not_implemented",
      sp_5: "not_implemented",
      // Vulnerability Management - no scanning, no process
      vm_1: "not_implemented",
      vm_2: "not_implemented",
      vm_3: "partially_implemented",
      vm_4: "not_implemented",
    };

    // Create assessment
    const assessResult = await db.insert(assessments).values({
      organizationId: org.id,
      status: "completed",
    }).returning();

    const assessment = assessResult[0];

    // Process and save answers
    const answerData: { questionId: string; category: string; answer: string; score: number; riskScore: number; riskLevel: string }[] = [];

    for (const [questionId, answer] of Object.entries(demoAnswers)) {
      const question = assessmentQuestions.find((q) => q.id === questionId);
      if (!question) continue;

      const risk = calculateQuestionRisk(answer, question.likelihood, question.impact);
      const score = calculateAnswerScore(answer);

      await db.insert(assessmentAnswers).values({
        assessmentId: assessment.id,
        questionId,
        category: question.category,
        questionText: question.question,
        answer,
        score: score >= 0 ? score : 0,
        likelihood: risk.likelihood,
        impact: risk.impact,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
      });

      answerData.push({
        questionId,
        category: question.category,
        answer,
        score: score >= 0 ? score : 0,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
      });
    }

    // Calculate and save category scores
    const catScores = calculateCategoryScores(
      answerData.map((a) => ({
        questionId: a.questionId,
        category: a.category,
        answer: a.answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable",
      }))
    );

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
      answerData.map((a) => ({
        questionId: a.questionId,
        category: a.category,
        answer: a.answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable",
      })),
      assessmentQuestions.length
    );

    await db.update(assessments).set({
      overallScore: overall.overallScore,
      riskLevel: overall.riskLevel,
      maturityLevel: overall.maturityLevel,
    }).where(eq(assessments.id, assessment.id));

    // Generate recommendations
    const recs = generateRecommendations(demoAnswers);
    for (const rec of recs.slice(0, 30)) {
      await db.insert(recommendations).values({
        assessmentId: assessment.id,
        organizationId: org.id,
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

    // Create roadmap items
    for (const item of defaultRoadmapItems) {
      await db.insert(roadmapItems).values({
        organizationId: org.id,
        title: item.title,
        description: item.description,
        phase: item.phase,
        category: item.category,
        status: item.phase === "first_30_days" ? "not_started" : "not_started",
      });
    }

    // Create security policies
    for (const policy of policyTemplates) {
      await db.insert(securityPolicies).values({
        organizationId: org.id,
        title: policy.title,
        description: policy.description,
        content: policy.content,
        category: policy.category,
      });
    }

    // Create KPIs with realistic values based on assessment
    const kpiData = [
      { name: "MFA Coverage", currentValue: 45, targetValue: 100, unit: "%", category: "Identity & Access Management" },
      { name: "Patch Compliance", currentValue: 60, targetValue: 95, unit: "%", category: "Vulnerability Management" },
      { name: "Backup Success Rate", currentValue: 50, targetValue: 100, unit: "%", category: "Backup & Disaster Recovery" },
      { name: "Employee Training Completion", currentValue: 0, targetValue: 100, unit: "%", category: "Employee Security Awareness" },
      { name: "Phishing Click Rate", currentValue: 15, targetValue: 3, unit: "%", category: "Employee Security Awareness" },
      { name: "Critical Vulnerabilities", currentValue: overall.riskDistribution.critical, targetValue: 0, unit: "count", category: "Vulnerability Management" },
      { name: "Open Security Gaps", currentValue: answerData.filter((a) => a.answer !== "fully_implemented" && a.answer !== "not_applicable").length, targetValue: 0, unit: "count", category: "Security Policies" },
      { name: "Completed Recommendations", currentValue: 0, targetValue: 100, unit: "%", category: "Security Policies" },
    ];

    for (const kpi of kpiData) {
      await db.insert(kpis).values({
        organizationId: org.id,
        name: kpi.name,
        currentValue: kpi.currentValue,
        targetValue: kpi.targetValue,
        unit: kpi.unit,
        category: kpi.category,
      });
    }

    // Create a sample incident
    await db.insert(incidents).values({
      organizationId: org.id,
      type: "phishing",
      incidentDate: "2024-11-15",
      severity: "medium",
      description: "Phishing email received by 5 employees targeting organizational email credentials. Two employees clicked the link but did not enter credentials.",
      affectedSystem: "Email System",
      status: "reviewing",
      responseActions: "Blocked sender domain, notified all staff, reminded about phishing reporting procedures.",
      lessonsLearned: "Need to implement phishing simulations and improve email filtering. Consider SPF/DKIM/DMARC configuration.",
    });

    return NextResponse.json({
      success: true,
      message: "Demo data created successfully",
      credentials: {
        systemAdmin: { username: "admin", password: "Admin@123" },
        ngoAdmin: { username: "ngo_admin", password: "Ngo@123" },
      },
      organization: { name: org.name, id: org.id },
      assessmentScore: overall.overallScore,
      maturityLevel: overall.maturityLevel,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 });
  }
}
