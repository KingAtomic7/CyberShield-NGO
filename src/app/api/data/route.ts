// Data API Route - Incidents, Roadmap, Policies, KPIs, Cost, Admin Stats
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incidents, roadmapItems, securityPolicies, kpis, recommendations, assessments, organizations, users, assessmentAnswers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { resolveOrgId } from "@/lib/access";
import { assessmentQuestions } from "@/lib/assessment-questions";
import { defaultCostCategories } from "@/lib/default-data";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const action = request.nextUrl.searchParams.get("action");
    const requestedOrgId = request.nextUrl.searchParams.get("orgId");
    const orgId = resolveOrgId(session, requestedOrgId);
    if (requestedOrgId && !orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (action === "incidents") {
      if (!orgId) return NextResponse.json({ incidents: [] });
      const data = await db.query.incidents.findMany({
        where: eq(incidents.organizationId, orgId),
        orderBy: (i, { desc }) => [desc(i.createdAt)],
      });
      return NextResponse.json({ incidents: data });
    }

    if (action === "roadmap") {
      if (!orgId) return NextResponse.json({ items: [] });
      const data = await db.query.roadmapItems.findMany({
        where: eq(roadmapItems.organizationId, orgId),
        orderBy: (r, { asc }) => [asc(r.createdAt)],
      });
      return NextResponse.json({ items: data });
    }

    if (action === "policies") {
      if (!orgId) return NextResponse.json({ policies: [] });
      const data = await db.query.securityPolicies.findMany({
        where: eq(securityPolicies.organizationId, orgId),
      });
      return NextResponse.json({ policies: data });
    }

    if (action === "kpis") {
      if (!orgId) return NextResponse.json({ kpis: [] });
      const data = await db.query.kpis.findMany({
        where: eq(kpis.organizationId, orgId),
      });
      return NextResponse.json({ kpis: data });
    }

    if (action === "recommendations") {
      if (!orgId) return NextResponse.json({ recommendations: [] });
      const data = await db.query.recommendations.findMany({
        where: eq(recommendations.organizationId, orgId),
        orderBy: (r, { asc }) => [asc(r.createdAt)],
      });
      return NextResponse.json({ recommendations: data });
    }

    if (action === "cost") {
      return NextResponse.json({ categories: defaultCostCategories });
    }

    if (action === "admin-stats") {
      if (session.role !== "sys_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      const allOrgs = await db.query.organizations.findMany();
      const allAssessments = await db.query.assessments.findMany();
      const allUsers = await db.query.users.findMany();
      const allRecs = await db.query.recommendations.findMany();

      const completedAssessments = allAssessments.filter((a) => a.status === "completed");
      const avgScore = completedAssessments.length > 0
        ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedAssessments.length)
        : 0;

      const criticalOrgs = completedAssessments.filter((a) => a.riskLevel === "critical").length;
      const highRiskOrgs = completedAssessments.filter((a) => a.riskLevel === "high").length;
      const avgMaturity = completedAssessments.length > 0
        ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.maturityLevel || 1), 0) / completedAssessments.length * 10) / 10
        : 0;

      // Most common categories in recommendations
      const categoryCount: Record<string, number> = {};
      for (const rec of allRecs) {
        const cat = rec.category || "Other";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      }
      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      return NextResponse.json({
        totalOrganizations: allOrgs.length,
        totalUsers: allUsers.length,
        totalAssessments: allAssessments.length,
        completedAssessments: completedAssessments.length,
        averageScore: avgScore,
        criticalRiskOrgs: criticalOrgs,
        highRiskOrgs: highRiskOrgs,
        averageMaturity: avgMaturity,
        topCategories,
        organizations: allOrgs.map((o) => {
          const orgAssessments = completedAssessments.filter((a) => a.organizationId === o.id);
          const latestAssessment = orgAssessments[orgAssessments.length - 1];
          return {
            id: o.id,
            name: o.name,
            type: o.type,
            score: latestAssessment?.overallScore || null,
            riskLevel: latestAssessment?.riskLevel || null,
            maturityLevel: latestAssessment?.maturityLevel || null,
          };
        }),
      });
    }

    if (action === "gap-analysis") {
      if (!orgId) return NextResponse.json({ gaps: [] });
      const assessResults = await db.query.assessments.findMany({
        where: eq(assessments.organizationId, orgId),
        orderBy: (a, { desc }) => [desc(a.createdAt)],
        limit: 1,
      });

      if (assessResults.length === 0) return NextResponse.json({ gaps: [] });

      const answers = await db.query.assessmentAnswers.findMany({
        where: eq(assessmentAnswers.assessmentId, assessResults[0].id),
      });

      const questionTexts: Record<string, { question: string; category: string }> = {};
      for (const q of assessmentQuestions) {
        questionTexts[q.id] = { question: q.question, category: q.category };
      }

      const answersMap: Record<string, "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable"> = {};
      for (const a of answers) {
        answersMap[a.questionId] = a.answer as "fully_implemented" | "partially_implemented" | "not_implemented" | "not_applicable";
      }

      const { generateGapAnalysis } = await import("@/lib/recommendations");
      const gaps = generateGapAnalysis(answersMap, questionTexts);

      return NextResponse.json({ gaps });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Data GET error:", error);
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
    const { action } = body;
    const requestedOrgId = typeof body.orgId === "string" ? body.orgId : null;
    const orgId = resolveOrgId(session, requestedOrgId);
    if (requestedOrgId && !orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (action === "create-incident") {
      if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });
      const result = await db.insert(incidents).values({
        organizationId: orgId,
        type: body.type,
        incidentDate: body.incidentDate,
        severity: body.severity,
        description: body.description,
        affectedSystem: body.affectedSystem || null,
        status: body.status || "identified",
        responseActions: body.responseActions || null,
        lessonsLearned: body.lessonsLearned || null,
      }).returning();
      return NextResponse.json({ incident: result[0] });
    }

    if (action === "update-roadmap") {
      const item = await db.query.roadmapItems.findFirst({ where: eq(roadmapItems.id, body.itemId) });
      if (!item) return NextResponse.json({ error: "Roadmap item not found" }, { status: 404 });
      if (!resolveOrgId(session, item.organizationId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await db.update(roadmapItems).set({ status: body.status }).where(eq(roadmapItems.id, body.itemId));
      const updated = await db.query.roadmapItems.findFirst({ where: eq(roadmapItems.id, body.itemId) });
      return NextResponse.json({ item: updated });
    }

    if (action === "update-incident") {
      const incident = await db.query.incidents.findFirst({ where: eq(incidents.id, body.itemId) });
      if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });
      if (!resolveOrgId(session, incident.organizationId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const updateData: Record<string, unknown> = {};
      if (body.status) updateData.status = body.status;
      if (body.responseActions) updateData.responseActions = body.responseActions;
      if (body.lessonsLearned) updateData.lessonsLearned = body.lessonsLearned;
      await db.update(incidents).set(updateData).where(eq(incidents.id, body.itemId));
      return NextResponse.json({ success: true });
    }

    if (action === "update-recommendation") {
      const rec = await db.query.recommendations.findFirst({ where: eq(recommendations.id, body.itemId) });
      if (!rec) return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
      if (!resolveOrgId(session, rec.organizationId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await db.update(recommendations).set({ status: body.status }).where(eq(recommendations.id, body.itemId));
      return NextResponse.json({ success: true });
    }

    if (action === "update-kpi") {
      const kpi = await db.query.kpis.findFirst({ where: eq(kpis.id, body.kpiId) });
      if (!kpi) return NextResponse.json({ error: "KPI not found" }, { status: 404 });
      if (!resolveOrgId(session, kpi.organizationId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await db.update(kpis).set({ currentValue: body.currentValue }).where(eq(kpis.id, body.kpiId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Data POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
