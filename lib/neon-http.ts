const NEON_SQL_API_URL = process.env.NEON_SQL_API_URL;
const NEON_SQL_API_KEY = process.env.NEON_SQL_API_KEY;

export async function neonQuery<T>(query: string, params: unknown[] = []): Promise<T[]> {
  if (!NEON_SQL_API_URL || !NEON_SQL_API_KEY) throw new Error("Missing NEON_SQL_API_URL or NEON_SQL_API_KEY");
  const res = await fetch(NEON_SQL_API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${NEON_SQL_API_KEY}`},
    body: JSON.stringify({ query, params }),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Neon SQL API error (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { rows?: T[] };
  return data.rows ?? [];
}
