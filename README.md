# Tanveer Ahmad Associates — NewDesignNodeJs

Modern Node.js + React (Next.js) redesign of [tanveerassociates.com](https://www.tanveerassociates.com/) with a secure admin panel for dynamic project/client content.

## Stack

- **Next.js 15** (React 19, App Router)
- **Prisma + PostgreSQL (Supabase)**
- **NextAuth** credentials auth
- **Zod** validation, upload hardening, security headers, login rate limiting

## Database (Supabase)

This app uses **PostgreSQL on Supabase** via Prisma.

1. Copy `.env.example` → `.env`
2. Set `DATABASE_URL` to your Supabase **Session pooler** connection string (port `5432`, user `postgres.<project-ref>`). Direct `db.*.supabase.co:5432` is often IPv6-only.
3. Run:

```bash
npm install
npm run db:setup
npm run dev
```

`db:setup` pushes the schema and seeds projects/admin content.

## Admin capabilities

- Projects / clients: add, edit, delete, enable/disable, featured flag, multi-image galleries
- Categories, team, hero sliders, contact messages, site settings
- Security: Argon/bcrypt password hashing, login attempt lockout, session JWT, CSRF via NextAuth, MIME/magic-byte upload checks, security headers (CSP, XFO, nosniff)

## Content source

Seed copies existing gallery images from `../wp-content/gallery` into `public/uploads`.
