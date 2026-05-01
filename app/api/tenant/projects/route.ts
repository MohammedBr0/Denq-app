import { NextRequest, NextResponse } from "next/server";
import { neonQuery } from "@/lib/neon-http";

type ProjectRow = { id: string; tenant_id: string; name: string; created_at: string };

export async function GET(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });

  const rows = await neonQuery<ProjectRow>(
    "select id, tenant_id, name, created_at from projects where tenant_id = $1 order by created_at desc",
    [tenantId]
  );

  return NextResponse.json({ projects: rows });
}
