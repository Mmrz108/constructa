import "server-only"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

function initialsFromName(name: string) {
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

export function buildInitialsAvatarSvg(name: string, userId: string) {
  const initials = initialsFromName(name)
  const bg = colorForId(userId)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="#ffffff">${initials}</text>
</svg>`
}

/** Data-URL avatar (works on Vercel; no local filesystem needed). */
export function createDefaultAvatarFile(userId: string, name: string): string {
  const svg = buildInitialsAvatarSvg(name, userId)
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`
}

function isBrokenLocalUploadPath(image: string) {
  return image.startsWith("/uploads/")
}

/** Ensure the user row has an image; generate one if missing or local-only. */
export async function ensureUserAvatar(params: {
  id: string
  name: string
  image?: string | null
}): Promise<string> {
  const current = params.image?.trim() ?? ""
  if (current && !isBrokenLocalUploadPath(current)) return current

  const url = createDefaultAvatarFile(params.id, params.name)
  await db
    .update(user)
    .set({ image: url, updatedAt: new Date() })
    .where(eq(user.id, params.id))
  return url
}

/** Backfill avatars for every user without a durable image. */
export async function backfillMissingAvatars() {
  const all = await db
    .select({ id: user.id, name: user.name, image: user.image })
    .from(user)
  let count = 0
  for (const row of all) {
    const current = row.image?.trim() ?? ""
    if (current && !isBrokenLocalUploadPath(current)) continue
    await ensureUserAvatar(row)
    count++
  }
  return count
}
