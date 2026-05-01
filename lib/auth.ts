import { createHash, randomBytes } from "crypto";

export function createVerificationToken() {
  const token = randomBytes(32).toString("hex");
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  return { token, tokenHash, expiresAt };
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
