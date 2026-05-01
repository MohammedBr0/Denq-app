import { NextRequest, NextResponse } from "next/server";
import { getTenantRole, parseNeonAuthHeader } from "./lib/tenant";

const PUBLIC_PATHS = ["/", "/api/upload"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next")) return NextResponse.next();

  const session = parseNeonAuthHeader(req.headers.get("x-neon-auth"));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = req.headers.get("x-tenant-id") || req.nextUrl.searchParams.get("tenantId");
  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

  const tenantRole = getTenantRole(session, tenantId);
  if (!tenantRole) return NextResponse.json({ error: "Forbidden for tenant" }, { status: 403 });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-tenant-id", tenantId);
  requestHeaders.set("x-tenant-role", tenantRole);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/api/:path*", "/analytics", "/microsites", "/pages/:path*", "/qrcodes"],
};
