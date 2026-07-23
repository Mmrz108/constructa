import "server-only"
import { db } from "@/lib/db"
import {
  checklistTemplate,
  membership,
  project,
  user,
} from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export type ImportResolveMaps = {
  projectByCode: Map<string, number>
  stageByKey: Map<string, number> // `${projectId ?? 0}:${nameLower}` and `0:nameLower`
  userByEmail: Map<string, string>
}

export async function loadResolveMaps(orgId: number): Promise<ImportResolveMaps> {
  const [projects, stages, members] = await Promise.all([
    db
      .select({ id: project.id, code: project.code })
      .from(project)
      .where(eq(project.orgId, orgId)),
    db
      .select({
        id: checklistTemplate.id,
        name: checklistTemplate.name,
        projectId: checklistTemplate.projectId,
      })
      .from(checklistTemplate)
      .where(eq(checklistTemplate.orgId, orgId)),
    db
      .select({ userId: membership.userId, email: user.email })
      .from(membership)
      .innerJoin(user, eq(user.id, membership.userId))
      .where(eq(membership.orgId, orgId)),
  ])

  const projectByCode = new Map<string, number>()
  for (const p of projects) {
    if (p.code) projectByCode.set(p.code.trim().toUpperCase(), p.id)
  }

  const stageByKey = new Map<string, number>()
  for (const s of stages) {
    const name = s.name.trim().toLowerCase()
    stageByKey.set(`0:${name}`, s.id)
    if (s.projectId) stageByKey.set(`${s.projectId}:${name}`, s.id)
  }

  const userByEmail = new Map<string, string>()
  for (const m of members) {
    userByEmail.set(m.email.toLowerCase(), m.userId)
  }

  return { projectByCode, stageByKey, userByEmail }
}

export function resolveProjectId(
  maps: ImportResolveMaps,
  code: string,
): number | null {
  if (!code) return null
  return maps.projectByCode.get(code.trim().toUpperCase()) ?? null
}

export function resolveStageId(
  maps: ImportResolveMaps,
  name: string,
  projectId?: number | null,
): number | null {
  if (!name) return null
  const key = name.trim().toLowerCase()
  if (projectId) {
    const hit = maps.stageByKey.get(`${projectId}:${key}`)
    if (hit) return hit
  }
  return maps.stageByKey.get(`0:${key}`) ?? null
}

export function resolveUserId(
  maps: ImportResolveMaps,
  email: string,
): string | null {
  if (!email) return null
  return maps.userByEmail.get(email.trim().toLowerCase()) ?? null
}

export async function refreshProjectMap(
  maps: ImportResolveMaps,
  orgId: number,
) {
  const projects = await db
    .select({ id: project.id, code: project.code })
    .from(project)
    .where(eq(project.orgId, orgId))
  maps.projectByCode.clear()
  for (const p of projects) {
    if (p.code) maps.projectByCode.set(p.code.trim().toUpperCase(), p.id)
  }
}

export async function findUserIdByEmail(email: string): Promise<string | null> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1)
  return rows[0]?.id ?? null
}

export async function ensureMembership(
  userId: string,
  orgId: number,
  role: string,
) {
  const existing = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))
    .limit(1)
  if (existing[0]) {
    await db
      .update(membership)
      .set({ role })
      .where(eq(membership.id, existing[0].id))
  } else {
    await db.insert(membership).values({ userId, orgId, role })
  }
}
