/**
 * Restore full-dump.sql to Neon over WebSockets (port 443).
 * Use when outbound TCP 5432 is blocked.
 *
 *   pnpm exec tsx scripts/restore-via-neon-ws.ts --yes
 */
import { readFileSync } from "fs"
import { resolve } from "path"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

function getEnv(path: string, key: string) {
  const line = readFileSync(path, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${key}=`))
  if (!line) return null
  let v = line.slice(key.length + 1).trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  return v
}

function splitSql(sql: string): string[] {
  const statements: string[] = []
  let buf = ""
  for (const raw of sql.split("\n")) {
    const line = raw.replace(/\r$/, "")
    if (!line.trim() || line.startsWith("--") || line.startsWith("\\")) continue
    buf += `${line}\n`
    if (line.trimEnd().endsWith(";")) {
      statements.push(buf.trim())
      buf = ""
    }
  }
  if (buf.trim()) statements.push(buf.trim())
  return statements
}

function buildDataUrlAvatar(userId: string, name: string) {
  const initials =
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  const colors = [
    "#0f766e",
    "#1d4ed8",
    "#b45309",
    "#be123c",
    "#7c3aed",
    "#047857",
    "#0369a1",
    "#9a3412",
  ]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash + userId.charCodeAt(i) * 17) % 997
  }
  const bg = colors[hash % colors.length]
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${initials}</text>
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`
}

async function main() {
  if (!process.argv.includes("--yes")) {
    console.error("Pass --yes to confirm destructive restore")
    process.exit(1)
  }

  const envPath = resolve(process.cwd(), ".env.vercel")
  const url =
    getEnv(envPath, "DATABASE_URL") ||
    getEnv(envPath, "DATABASE_URL_UNPOOLED") ||
    process.env.DATABASE_URL
  if (!url) {
    console.error("Missing DATABASE_URL in .env.vercel")
    process.exit(1)
  }

  const statements = splitSql(
    readFileSync(
      resolve(process.cwd(), "scripts/seed-data/full-dump.sql"),
      "utf8",
    ),
  )

  const pool = new Pool({ connectionString: url, max: 1 })
  console.log(
    `Restoring ${statements.length} statements via Neon WS →`,
    url.replace(/:[^:@/]+@/, ":***@"),
  )

  const client = await pool.connect()
  try {
    console.log("Wiping public schema…")
    await client.query(`DROP SCHEMA IF EXISTS public CASCADE`)
    await client.query(`CREATE SCHEMA public`)
    await client.query(`GRANT ALL ON SCHEMA public TO public`)
    await client.query(`GRANT ALL ON SCHEMA public TO CURRENT_USER`)

    // After a clean schema, skip DROP* noise from pg_dump --clean
    const toRun = statements.filter((s) => !/^\s*DROP\b/i.test(s))
    console.log(`Applying ${toRun.length} create/insert statements…`)

    let ok = 0
    for (const statement of toRun) {
      try {
        await client.query(statement)
        ok++
        if (ok % 50 === 0) console.log(`… ${ok}/${toRun.length}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (/does not exist/i.test(msg) && /^DROP /i.test(statement)) {
          ok++
          continue
        }
        console.error("Failed:\n", statement.slice(0, 240))
        throw err
      }
    }
    console.log(`Applied ${ok}/${toRun.length}`)

    await client.query(`SET search_path TO public`)
    const users = await client.query<{
      id: string
      name: string
      image: string | null
    }>(`SELECT id, name, image FROM public."user"`)

    let avatars = 0
    for (const u of users.rows) {
      if (u.image && !u.image.startsWith("/uploads/")) continue
      const image = buildDataUrlAvatar(u.id, u.name)
      await client.query(
        `UPDATE public."user" SET image = $1, "updatedAt" = NOW() WHERE id = $2`,
        [image, u.id],
      )
      avatars++
    }
    console.log(`Normalized ${avatars} avatars`)
    console.log("Restore complete")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
