export type TenantRole = "owner" | "admin" | "member";

export type TenantMembership = {
  tenantId: string;
  role: TenantRole;
};

export type NeonAuthSession = {
  userId: string;
  email: string;
  memberships: TenantMembership[];
};

export function parseNeonAuthHeader(value: string | null): NeonAuthSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as NeonAuthSession;
    if (!parsed.userId || !parsed.email || !Array.isArray(parsed.memberships)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getTenantRole(session: NeonAuthSession, tenantId: string): TenantRole | null {
  return session.memberships.find((m) => m.tenantId === tenantId)?.role ?? null;
}

export function hasTenantAccess(session: NeonAuthSession, tenantId: string) {
  return !!getTenantRole(session, tenantId);
}

export function hasRequiredRole(role: TenantRole, allowedRoles: TenantRole[]) {
  return allowedRoles.includes(role);
}
