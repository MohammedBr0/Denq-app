import { NextRequest, NextResponse } from "next/server";
import { neonQuery } from "@/lib/neon-http";
import { sha256 } from "@/lib/auth";

type TokenRow = { user_id: string; expires_at: string; used_at: string | null };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body?.token as string | undefined;
  if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

  const tokenHash = sha256(token);
  const rows = await neonQuery<TokenRow>(
    `select user_id, expires_at, used_at
     from email_verification_tokens
     where token_hash = $1
     order by created_at desc
     limit 1`,
    [tokenHash]
  );

  const row = rows[0];
  if (!row) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  if (row.used_at) return NextResponse.json({ error: "Token already used" }, { status: 409 });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  await neonQuery(`update users set email_verified_at = now() where id = $1`, [row.user_id]);
  await neonQuery(`update email_verification_tokens set used_at = now() where token_hash = $1`, [tokenHash]);

  return NextResponse.json({ message: "Email verified" });
}
