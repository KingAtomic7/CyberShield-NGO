// Organization API Route
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { resolveOrgId } from "@/lib/access";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requestedOrgId = request.nextUrl.searchParams.get("id");
    const orgId = resolveOrgId(session, requestedOrgId);

    if (requestedOrgId && !orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (orgId) {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.id, orgId),
      });
      if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      return NextResponse.json({ organization: org });
    }

    // Return user's organization
    if (session.organizationId) {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.id, session.organizationId),
      });
      if (org) return NextResponse.json({ organization: org });
    }

    // Admin can see all
    if (session.role === "sys_admin") {
      const allOrgs = await db.query.organizations.findMany();
      return NextResponse.json({ organizations: allOrgs });
    }

    return NextResponse.json({ organization: null });
  } catch (error) {
    console.error("Organization GET error:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, type, numEmployees, numVolunteers, numLocations, annualItBudget, itStaffCount, usesCloudServices, usesOnlineBanking, storesDonorData, storesBeneficiaryData, storesEmployeeData, usesThirdPartyVendors } = body;

    // Existing NGO admins cannot create a second organization and thereby escape their tenant boundary.
    if (session.role === "ngo_admin" && session.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!name) return NextResponse.json({ error: "Organization name is required" }, { status: 400 });

    // Security: Input sanitization - limit string lengths
    const sanitizedName = String(name).slice(0, 255);
    const sanitizedType = type ? String(type).slice(0, 100) : null;

    const result = await db.insert(organizations).values({
      name: sanitizedName,
      type: sanitizedType,
      numEmployees: Number(numEmployees) || 0,
      numVolunteers: Number(numVolunteers) || 0,
      numLocations: Number(numLocations) || 1,
      annualItBudget: Number(annualItBudget) || 0,
      itStaffCount: Number(itStaffCount) || 0,
      usesCloudServices: Boolean(usesCloudServices),
      usesOnlineBanking: Boolean(usesOnlineBanking),
      storesDonorData: Boolean(storesDonorData),
      storesBeneficiaryData: Boolean(storesBeneficiaryData),
      storesEmployeeData: Boolean(storesEmployeeData),
      usesThirdPartyVendors: Boolean(usesThirdPartyVendors),
    }).returning();

    const org = result[0];

    // Link organization to current user
    await db.update(users).set({ organizationId: org.id }).where(eq(users.id, session.userId));

    return NextResponse.json({ organization: org });
  } catch (error) {
    console.error("Organization POST error:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    const resolvedOrgId = resolveOrgId(session, id);
    if (!resolvedOrgId || resolvedOrgId !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Security: Input sanitization
    const sanitized: Record<string, unknown> = {};
    if (updateData.name) sanitized.name = String(updateData.name).slice(0, 255);
    if (updateData.type) sanitized.type = String(updateData.type).slice(0, 100);
    if (updateData.numEmployees !== undefined) sanitized.numEmployees = Number(updateData.numEmployees) || 0;
    if (updateData.numVolunteers !== undefined) sanitized.numVolunteers = Number(updateData.numVolunteers) || 0;
    if (updateData.numLocations !== undefined) sanitized.numLocations = Number(updateData.numLocations) || 1;
    if (updateData.annualItBudget !== undefined) sanitized.annualItBudget = Number(updateData.annualItBudget) || 0;
    if (updateData.itStaffCount !== undefined) sanitized.itStaffCount = Number(updateData.itStaffCount) || 0;
    if (updateData.usesCloudServices !== undefined) sanitized.usesCloudServices = Boolean(updateData.usesCloudServices);
    if (updateData.usesOnlineBanking !== undefined) sanitized.usesOnlineBanking = Boolean(updateData.usesOnlineBanking);
    if (updateData.storesDonorData !== undefined) sanitized.storesDonorData = Boolean(updateData.storesDonorData);
    if (updateData.storesBeneficiaryData !== undefined) sanitized.storesBeneficiaryData = Boolean(updateData.storesBeneficiaryData);
    if (updateData.storesEmployeeData !== undefined) sanitized.storesEmployeeData = Boolean(updateData.storesEmployeeData);
    if (updateData.usesThirdPartyVendors !== undefined) sanitized.usesThirdPartyVendors = Boolean(updateData.usesThirdPartyVendors);

    await db.update(organizations).set(sanitized).where(eq(organizations.id, id));

    const updated = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });

    return NextResponse.json({ organization: updated });
  } catch (error) {
    console.error("Organization PUT error:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
