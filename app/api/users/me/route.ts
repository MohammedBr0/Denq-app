import { NextRequest, NextResponse } from "next/server";
import { neonQuery } from "@/lib/neon-http";

type UserRow = { id: string; email: string; email_verified_at: string | null; created_at: string };

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing authenticated user" }, { status: 401 });

  const rows = await neonQuery<UserRow>(
    `select id, email, email_verified_at, created_at
     from users
     where id = $1
     limit 1`,
    [userId]
  );

  if (!rows[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user: rows[0] });
}
