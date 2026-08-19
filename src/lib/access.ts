import type { SessionPayload } from "@/lib/auth";

/**
 * Resolve an organization id from a request while enforcing tenant boundaries.
 * NGO admins are permanently scoped to their own organization. System admins
 * may explicitly select another organization for administrative operations.
 */
export function resolveOrgId(session: SessionPayload, requestedOrgId?: string | null): string | null {
  const requested = typeof requestedOrgId === "string" ? requestedOrgId.trim() || null : null;

  if (session.role === "sys_admin") {
    return requested || session.organizationId || null;
  }

  if (session.role === "ngo_admin") {
    if (!session.organizationId) return null;
    if (requested && requested !== session.organizationId) return null;
    return session.organizationId;
  }

  return null;
}
