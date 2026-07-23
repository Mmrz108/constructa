# Deploy Bonyan to Vercel (with legacy data)

This repo includes a full database dump of the migrated legacy portal data
(`scripts/seed-data/full-dump.sql`): users, projects, directory contacts,
memberships, stages metadata, and related records.

## 1. Push is already on GitHub

Repository: https://github.com/Mmrz108/constructa  
Branch: `bonyan` (also mirrored to `main` for Vercel default deploys)

## 2. Create a Postgres database

Recommended: [Neon](https://neon.tech) or Vercel Postgres.

Copy the connection string (prefer the **pooled** URL for the app).

## 3. Import legacy data into that database

From your machine (with the production `DATABASE_URL`):

```bash
pnpm install
DATABASE_URL="postgres://USER:PASS@HOST/DB?sslmode=require" pnpm db:restore -- --yes
```

This recreates schema + loads all imported site data and login password hashes.

### Default logins after restore

| Account | Password |
|---------|----------|
| Legacy users (`*@test.com`, `bonyan_*@gmail.com`, etc.) | `Bonyan123!` |
| Role demos (`admin@bonyan.test`, `client@bonyan.test`, …) | `Test1234!` |
| `admin@test.com` | `Bonyan123!` |

Change passwords after go-live.

## 4. Connect the repo in Vercel

1. Import `Mmrz108/constructa` in Vercel.
2. Framework: **Next.js** (auto-detected).
3. Root directory: `.`
4. Set Environment Variables (Production + Preview):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | long random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | your Vercel URL, e.g. `https://your-app.vercel.app` |

5. Deploy.

After the first deploy, update `BETTER_AUTH_URL` if the production domain changed, then redeploy.

## 5. Verify

1. Open `/sign-in`
2. Sign in as `admin@test.com` / `Bonyan123!`
3. Check **Users**, **Projects**, and the project switcher — legacy names should appear.

## Notes

- Profile photos are stored as data URLs so they work on Vercel’s read-only filesystem.
- Re-running `pnpm db:restore -- --yes` **wipes** the target DB and reloads the dump.
- To refresh the dump from local Docker later:

```bash
docker exec ex0-db pg_dump -U user -d constructa --no-owner --no-acl --clean --if-exists --inserts --column-inserts --exclude-table-data=session --exclude-table-data=verification > scripts/seed-data/full-dump.sql
```
