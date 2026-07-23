/**
 * Restore the Bonyan production/staging database from the committed full dump.
 *
 * Usage:
 *   DATABASE_URL="postgres://..." pnpm db:restore -- --yes
 *
 * Or with .env.local / .env already set:
 *   pnpm db:restore -- --yes
 *
 * WARNING: This drops and recreates app tables (clean restore).
 */
import { config } from "dotenv"
import { resolve } from "path"
import { readFileSync } from "fs"
import { Pool } from "pg"

config({ path: resolve(process.cwd(), ".env.local") })
config()

const yes = process.argv.includes("--yes")
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("Missing DATABASE_URL")
  process.exit(1)
}

if (!yes) {
  console.error(
    "Refusing to run without --yes (this wipes/reloads the target database).",
  )
  process.exit(1)
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

async function main() {
  const dumpPath = resolve(process.cwd(), "scripts/seed-data/full-dump.sql")
  const sql = readFileSync(dumpPath, "utf8")
  const statements = splitSql(sql)

  const needsSsl =
    !/localhost|127\.0\.0\.1/i.test(databaseUrl!) &&
    process.env.PGSSL !== "0"

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 1,
  })

  console.log(`Restoring ${statements.length} statements → ${databaseUrl!.replace(/:[^:@/]+@/, ":***@")}`)

  const client = await pool.connect()
  try {
    let ok = 0
    for (const statement of statements) {
      try {
        await client.query(statement)
        ok++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        // Ignore "does not exist" on DROP IF EXISTS race / empty DB edge cases
        if (/does not exist/i.test(msg) && /^DROP /i.test(statement)) {
          ok++
          continue
        }
        console.error("Failed statement:\n", statement.slice(0, 240))
        throw err
      }
    }
    console.log(`Applied ${ok}/${statements.length} statements.`)

    // Dump sets search_path to empty — reset for follow-up queries.
    await client.query(`SET search_path TO public`)

    // Convert local /uploads/avatar paths to durable data-URL initials
    const users = await client.query<{ id: string; name: string; image: string | null }>(
      `SELECT id, name, image FROM public."user"`,
    )
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
    console.log(`Normalized ${avatars} profile photos to data URLs.`)
    console.log("Restore complete.")
  } finally {
    client.release()
    await pool.end()
  }
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
  for (let i = 0; i < userId.length; i++) hash = (hash + userId.charCodeAt(i) * 17) % 997
  const bg = colors[hash % colors.length]
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${initials}</text>
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
