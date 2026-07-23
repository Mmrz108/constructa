# Bonyan Construction Portal

Next.js supervision portal (projects, inspections, NCRs, defects, daily reports, users, settings, import/export) with data migrated from the legacy Bonyan site.

## Quick start (local)

```bash
pnpm install
cp .env.example .env.local
# set DATABASE_URL to your Postgres instance
pnpm db:restore -- --yes
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel with legacy data

See **[DEPLOY.md](./DEPLOY.md)** for the full checklist:

1. Create Neon / Vercel Postgres
2. Run `pnpm db:restore -- --yes` against that database
3. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` in Vercel
4. Deploy from GitHub (`Mmrz108/constructa`)

## Demo logins (after restore)

| Email | Password | Role |
|-------|----------|------|
| `admin@test.com` | `Bonyan123!` | Admin (legacy) |
| `admin@bonyan.test` | `Test1234!` | Admin (demo) |
| other `*@bonyan.test` | `Test1234!` | per role |
| imported legacy users | `Bonyan123!` | client / contractor / supervisor |

## Stack

- Next.js 16 + React 19
- Better Auth
- Drizzle ORM + Postgres
- EN / AR locale switcher
