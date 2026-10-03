# Database (Supabase PostgreSQL)

This application stores all CMS data in **Supabase PostgreSQL**. The schema and seed live in the repo; **runtime data** lives in your Supabase project.

## Project

| Item | Value |
|------|--------|
| Supabase project ref | `aarcuirfuvkvosglwjjn` |
| Dashboard | https://supabase.com/dashboard/project/aarcuirfuvkvosglwjjn |
| Pooler region (IPv4) | `ap-northeast-1` (Session pooler, port `5432`) |

Free-tier projects **pause after inactivity**. If the site shows database errors, open the dashboard and click **Restore project**, then wait 2–3 minutes.

## Setup on a new machine

1. Copy `.env.example` → `.env` and set `DATABASE_URL` (Session pooler string from Supabase **Connect**).
2. Run:

```bash
npm run db:setup
```

This runs `prisma db push` and `prisma/seed.ts` (projects, categories, team, sliders, admin user, home sections).

## Helper scripts

```bash
# After restoring a paused project, wait until Prisma can connect
node scripts/wait-for-db.mjs

# Restore via Management API (requires SUPABASE_ACCESS_TOKEN)
# https://supabase.com/dashboard/account/tokens
set SUPABASE_ACCESS_TOKEN=your_token
node scripts/restore-supabase.mjs
```

**Do not commit `.env`** — it contains database credentials and auth secrets.
