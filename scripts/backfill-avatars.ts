import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { Pool } from "pg"

const COLORS = [
  "#0f766e",
  "#1d4ed8",
  "#b45309",
  "#be123c",
  "#7c3aed",
  "#047857",
  "#0369a1",
  "#9a3412",
]

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

function colorForId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * 17) % 997
  return COLORS[hash % COLORS.length]
}

function dataUrlAvatar(name: string, id: string) {
  const bg = colorForId(id)
  const text = initials(name)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${text}</text>
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 })
  const { rows } = await pool.query<{ id: string; name: string; image: string | null }>(
    `SELECT id, name, image FROM "user"`,
  )

  let n = 0
  for (const u of rows) {
    const current = u.image?.trim() ?? ""
    if (current && !current.startsWith("/uploads/")) continue
    const url = dataUrlAvatar(u.name, u.id)
    await pool.query(`UPDATE "user" SET image = $1, "updatedAt" = NOW() WHERE id = $2`, [
      url,
      u.id,
    ])
    n++
    console.log("avatar:", u.name)
  }
  console.log("done, created", n)
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
