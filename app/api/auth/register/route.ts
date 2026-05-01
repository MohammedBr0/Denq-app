import { NextRequest, NextResponse } from "next/server";
import { neonQuery } from "@/lib/neon-http";
import { createVerificationToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, email } = body as { userId?: string; email?: string };

  if (!userId || !email) {
    return NextResponse.json({ error: "userId and email are required" }, { status: 400 });
  }

  await neonQuery(
    `insert into users (id, email, email_verified_at)
     values ($1, $2, null)
     on conflict (id) do update set email = excluded.email`,
    [userId, email]
  );

  const verification = createVerificationToken();

  await neonQuery(
    `insert into email_verification_tokens (user_id, token_hash, expires_at)
     values ($1, $2, $3)`,
    [userId, verification.tokenHash, verification.expiresAt]
  );

  return NextResponse.json({
    message: "User created. Send this token via email using your provider.",
    verificationToken: verification.token,
    expiresAt: verification.expiresAt,
  });
}
