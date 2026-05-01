# Denq App — Multi-tenant SaaS Starter (Neon Auth Ready)

This starter now includes:
- Tenant auth/session parsing (`lib/tenant.ts`)
- Tenant middleware guard (`middleware.ts`)
- Neon SQL API helper (`lib/neon-http.ts`)
- Tenant projects API (`/api/tenant/projects`)
- Role-based user management API (`/api/users/me`, `/api/tenant/members`)
- Email verification flow (`/api/auth/register`, `/api/auth/verify-email`)
- Starter Postgres schema (`db/schema.sql`)

## Role-based tenant management
`x-neon-auth` memberships include roles: `owner`, `admin`, `member`.

- `GET /api/tenant/members`: owner/admin/member
- `POST/PATCH /api/tenant/members`: owner/admin (only owner can assign owner)
- `DELETE /api/tenant/members?userId=...`: owner/admin (only owner can remove owner)

Middleware injects `x-user-id`, `x-tenant-id`, and `x-tenant-role` into protected requests.

## Environment

```bash
NEON_SQL_API_URL="https://<neon-sql-api-endpoint>"
NEON_SQL_API_KEY="<neon-sql-api-key>"
```
