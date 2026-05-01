import { NextRequest, NextResponse } from "next/server";
import { neonQuery } from "@/lib/neon-http";
import { hasRequiredRole, TenantRole } from "@/lib/tenant";

type MemberRow = { user_id: string; email: string; role: TenantRole; created_at: string };

function getContext(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id");
  const actorUserId = req.headers.get("x-user-id");
  const actorRole = req.headers.get("x-tenant-role") as TenantRole | null;
  return { tenantId, actorUserId, actorRole };
}

function requireRole(req: NextRequest, allowed: TenantRole[]) {
  const { tenantId, actorUserId, actorRole } = getContext(req);
  if (!tenantId || !actorUserId || !actorRole) {
    return { error: NextResponse.json({ error: "Missing tenant auth context" }, { status: 400 }) };
  }
  if (!hasRequiredRole(actorRole, allowed)) {
    return { error: NextResponse.json({ error: "Insufficient role" }, { status: 403 }) };
  }
  return { tenantId, actorUserId, actorRole };
}

export async function GET(req: NextRequest) {
  const access = requireRole(req, ["owner", "admin", "member"]);
  if ("error" in access) return access.error;

  const rows = await neonQuery<MemberRow>(
    `select tm.user_id, u.email, tm.role, tm.created_at
     from tenant_memberships tm
     join users u on u.id = tm.user_id
     where tm.tenant_id = $1
     order by tm.created_at asc`,
    [access.tenantId]
  );

  return NextResponse.json({ members: rows, actorRole: access.actorRole });
}

export async function POST(req: NextRequest) {
  const access = requireRole(req, ["owner", "admin"]);
  if ("error" in access) return access.error;

  const body = await req.json();
  const { userId, role } = body as { userId?: string; role?: TenantRole };
  if (!userId || !role) return NextResponse.json({ error: "userId and role are required" }, { status: 400 });

  if (role === "owner" && access.actorRole !== "owner") {
    return NextResponse.json({ error: "Only owners can assign owner role" }, { status: 403 });
  }

  await neonQuery(
    `insert into tenant_memberships (tenant_id, user_id, role)
     values ($1, $2, $3)
     on conflict (tenant_id, user_id) do update set role = excluded.role`,
    [access.tenantId, userId, role]
  );

  return NextResponse.json({ message: "Member upserted" });
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  const access = requireRole(req, ["owner", "admin"]);
  if ("error" in access) return access.error;

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId query param required" }, { status: 400 });

  const targetRows = await neonQuery<{ role: TenantRole }>(
    `select role from tenant_memberships where tenant_id = $1 and user_id = $2 limit 1`,
    [access.tenantId, userId]
  );

  const targetRole = targetRows[0]?.role;
  if (!targetRole) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  if (targetRole === "owner" && access.actorRole !== "owner") {
    return NextResponse.json({ error: "Only owners can remove owners" }, { status: 403 });
  }

  await neonQuery(`delete from tenant_memberships where tenant_id = $1 and user_id = $2`, [access.tenantId, userId]);
  return NextResponse.json({ message: "Member removed" });
}
