# Tanveer Ahmad Associates — NewDesignNodeJs

Modern Node.js + React (Next.js) redesign of [tanveerassociates.com](https://www.tanveerassociates.com/) with a secure admin panel for dynamic project/client content.

## Stack

- **Next.js 15** (React 19, App Router)
- **Prisma + SQLite** (swap to MySQL/Postgres via `DATABASE_URL`)
- **NextAuth** credentials auth
- **Zod** validation, upload hardening, security headers, login rate limiting

## Run

```bash
cd "D:\AI Work\Tanveerassociates\NewDesignNodeJs"
npm install
npm run db:setup
npm run dev
```

- Website: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

### Default admin

- Email: `admin@tanveerassociates.com`
- Password: `Admin@TAA2026!`

Change these in `.env` before production and re-run seed (or update the user in DB).

## Admin capabilities

- Projects / clients: add, edit, delete, enable/disable, featured flag, multi-image galleries
- Categories, team, hero sliders, contact messages, site settings
- Security: Argon/bcrypt password hashing, login attempt lockout, session JWT, CSRF via NextAuth, MIME/magic-byte upload checks, security headers (CSP, XFO, nosniff)

## Content source

Seed copies existing gallery images from `../wp-content/gallery` into `public/uploads`.
