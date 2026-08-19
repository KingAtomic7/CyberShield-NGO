// Report Generation API - Generates PDF assessment report
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assessments, assessmentAnswers, riskResults, recommendations, organizations, kpis } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { resolveOrgId } from "@/lib/access";
import PDFDocument from "pdfkit";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requestedOrgId = request.nextUrl.searchParams.get("orgId");
    const orgId = resolveOrgId(session, requestedOrgId);
    if (requestedOrgId && !orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });

    // Fetch all data
    const org = await db.query.organizations.findFirst({ where: eq(organizations.id, orgId) });
    const assessResults = await db.query.assessments.findMany({
      where: eq(assessments.organizationId, orgId),
      orderBy: (a, { desc }) => [desc(a.createdAt)],
      limit: 1,
    });
    const assessment = assessResults[0];
    const answers = assessment ? await db.query.assessmentAnswers.findMany({ where: eq(assessmentAnswers.assessmentId, assessment.id) }) : [];
    const riskResultsData = assessment ? await db.query.riskResults.findMany({ where: eq(riskResults.assessmentId, assessment.id) }) : [];
    const recs = await db.query.recommendations.findMany({ where: eq(recommendations.organizationId, orgId) });
    const kpiData = await db.query.kpis.findMany({ where: eq(kpis.organizationId, orgId) });

    // Generate PDF
    const doc = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    const maturityLabels = ["", "Initial", "Basic", "Managed", "Advanced", "Optimized"];
    const riskLevelColors: Record<string, string> = { critical: "#dc2626", high: "#ea580c", medium: "#ca8a04", low: "#16a34a" };

    // Cover Page
    doc.rect(0, 0, 595, 842).fill("#0f172a");
    doc.fillColor("#06b6d4").fontSize(14).text("CyberShield NGO", 50, 200, { align: "center" });
    doc.fillColor("#ffffff").fontSize(28).text("Cybersecurity Assessment Report", 50, 240, { align: "center" });
    doc.fillColor("#94a3b8").fontSize(12).text("Practical Cybersecurity for Resource-Constrained Non-Profit Organizations", 50, 290, { align: "center" });
    doc.fillColor("#ffffff").fontSize(16).text(org?.name || "Organization", 50, 360, { align: "center" });
    doc.fillColor("#94a3b8").fontSize(11).text(`Report Date: ${new Date().toLocaleDateString()}`, 50, 400, { align: "center" });
    if (assessment) {
      doc.fillColor("#ffffff").fontSize(48).text(String(assessment.overallScore || 0), 50, 460, { align: "center" });
      doc.fillColor("#94a3b8").fontSize(12).text("Overall Security Score", 50, 520, { align: "center" });
      doc.fillColor(riskLevelColors[assessment.riskLevel || "medium"] || "#ca8a04").fontSize(14).text(`Risk Level: ${(assessment.riskLevel || "medium").toUpperCase()}`, 50, 550, { align: "center" });
    }
    doc.fillColor("#64748b").fontSize(9).text("This is a defensive cybersecurity assessment report. EY GDS Training Project.", 50, 780, { align: "center" });

    // Executive Summary
    doc.addPage();
    doc.fillColor("#1e40af").fontSize(18).text("Executive Summary", 50, 50);
    doc.moveTo(50, 75).lineTo(545, 75).strokeColor("#1e40af").stroke();
    doc.fillColor("#000000").fontSize(10);

    if (assessment) {
      doc.text(`Organization: ${org?.name || "N/A"}`, 50, 90);
      doc.text(`Overall Security Score: ${assessment.overallScore || 0}/100`, 50, 105);
      doc.text(`Risk Level: ${(assessment.riskLevel || "medium").toUpperCase()}`, 50, 120);
      doc.text(`Maturity Level: Level ${assessment.maturityLevel || 1} – ${maturityLabels[assessment.maturityLevel || 1]}`, 50, 135);
      doc.text(`Target Maturity: Level ${Math.min((assessment.maturityLevel || 1) + 1, 5)} – ${maturityLabels[Math.min((assessment.maturityLevel || 1) + 1, 5)]}`, 50, 150);

      const dist = { critical: 0, high: 0, medium: 0, low: 0 };
      answers.forEach((a: any) => { if (dist[a.riskLevel as keyof typeof dist] !== undefined) dist[a.riskLevel as keyof typeof dist]++; });
      doc.text(`Critical Risks: ${dist.critical} | High Risks: ${dist.high} | Medium Risks: ${dist.medium} | Low Risks: ${dist.low}`, 50, 175);
      doc.text(`Total Recommendations: ${recs.length}`, 50, 195);
    } else {
      doc.text("No assessment data available.", 50, 90);
    }

    // Organization Profile
    doc.fillColor("#1e40af").fontSize(18).text("Organization Profile", 50, 230);
    doc.moveTo(50, 255).lineTo(545, 255).strokeColor("#1e40af").stroke();
    doc.fillColor("#000000").fontSize(10);
    if (org) {
      doc.text(`Name: ${org.name}`, 50, 270);
      doc.text(`Type: ${org.type || "N/A"}`, 50, 285);
      doc.text(`Employees: ${org.numEmployees} | Volunteers: ${org.numVolunteers} | IT Staff: ${org.itStaffCount}`, 50, 300);
      doc.text(`Locations: ${org.numLocations} | Annual IT Budget: ₹${(org.annualItBudget || 0).toLocaleString()}`, 50, 315);
    }

    // Category Scores
    doc.fillColor("#1e40af").fontSize(18).text("Category Scores", 50, 360);
    doc.moveTo(50, 385).lineTo(545, 385).strokeColor("#1e40af").stroke();
    doc.fillColor("#000000").fontSize(10);
    let yPos = 400;
    for (const rr of riskResultsData) {
      const color = riskLevelColors[rr.riskLevel || "medium"] || "#000000";
      doc.fillColor("#000000").text(`${rr.category}: ${rr.categoryScore}%`, 50, yPos);
      doc.fillColor(color).text((rr.riskLevel || "medium").toUpperCase(), 400, yPos);
      yPos += 18;
    }

    // Top Recommendations
    if (recs.length > 0) {
      if (yPos > 650) { doc.addPage(); yPos = 50; }
      else yPos += 30;
      doc.fillColor("#1e40af").fontSize(18).text("Top Recommendations", 50, yPos);
      doc.moveTo(50, yPos + 25).lineTo(545, yPos + 25).strokeColor("#1e40af").stroke();
      yPos += 40;
      doc.fillColor("#000000").fontSize(9);
      for (const rec of recs.slice(0, 15)) {
        const color = riskLevelColors[rec.risk || "medium"] || "#000000";
        doc.fillColor("#000000").text(`• ${rec.title}`, 50, yPos, { width: 400 });
        doc.fillColor(color).text(`[${(rec.risk || "medium").toUpperCase()} | ${(rec.priority || "").replace(/_/g, " ").toUpperCase()}]`, 460, yPos);
        yPos += 14;
        doc.fillColor("#666666").text(`  ${rec.costEstimate || ""} | ${rec.implementationTime || ""}`, 50, yPos);
        yPos += 16;
        if (yPos > 750) { doc.addPage(); yPos = 50; }
      }
    }

    // KPIs
    if (kpiData.length > 0) {
      yPos += 20;
      if (yPos > 700) { doc.addPage(); yPos = 50; }
      doc.fillColor("#1e40af").fontSize(18).text("Security KPIs", 50, yPos);
      doc.moveTo(50, yPos + 25).lineTo(545, yPos + 25).strokeColor("#1e40af").stroke();
      yPos += 40;
      doc.fillColor("#000000").fontSize(10);
      for (const kpi of kpiData) {
        doc.text(`${kpi.name}: ${kpi.currentValue}${kpi.unit} (Target: ${kpi.targetValue}${kpi.unit})`, 50, yPos);
        yPos += 18;
      }
    }

    // Conclusion
    yPos += 30;
    if (yPos > 700) { doc.addPage(); yPos = 50; }
    doc.fillColor("#1e40af").fontSize(18).text("Conclusion", 50, yPos);
    doc.moveTo(50, yPos + 25).lineTo(545, yPos + 25).strokeColor("#1e40af").stroke();
    doc.fillColor("#000000").fontSize(10);
    yPos += 40;
    doc.text("This assessment identifies significant opportunities for cybersecurity improvement. The prioritized recommendations and implementation roadmap provide a practical, cost-effective path to strengthening your organization's security posture.", 50, yPos, { width: 495 });
    yPos += 40;
    doc.text("Security is a journey, not a destination. Regular reassessment and continuous improvement are essential to maintaining an effective cybersecurity program.", 50, yPos, { width: 495 });
    yPos += 40;
    doc.fillColor("#64748b").fontSize(8).text("This report was generated by CyberShield NGO – EY GDS Training Project. Illustrative estimates only.", 50, yPos);

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CyberShield_Assessment_Report_${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
