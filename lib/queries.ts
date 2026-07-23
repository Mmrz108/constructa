import "server-only"
import { db } from "@/lib/db"
import {
  project,
  inspection,
  ncr,
  defect,
  dailyReport,
  checklistTemplate,
  progressSnapshot,
} from "@/lib/db/schema"
import { and, asc, desc, eq, count, inArray } from "drizzle-orm"

/** All queries are scoped by orgId — this is the tenant isolation boundary. */

export async function getProjects(orgId: number) {
  return db
    .select()
    .from(project)
    .where(eq(project.orgId, orgId))
    .orderBy(desc(project.createdAt))
}

export async function getProject(orgId: number, id: number) {
  const rows = await db
    .select()
    .from(project)
    .where(and(eq(project.orgId, orgId), eq(project.id, id)))
    .limit(1)
  return rows[0] ?? null
}

export async function getInspections(orgId: number) {
  return db
    .select({
      id: inspection.id,
      title: inspection.title,
      type: inspection.type,
      location: inspection.location,
      discipline: inspection.discipline,
      status: inspection.status,
      priority: inspection.priority,
      scheduledFor: inspection.scheduledFor,
      createdAt: inspection.createdAt,
      projectId: inspection.projectId,
      projectName: project.name,
    })
    .from(inspection)
    .innerJoin(project, eq(project.id, inspection.projectId))
    .where(eq(inspection.orgId, orgId))
    .orderBy(desc(inspection.createdAt))
}

export async function getInspection(orgId: number, id: number) {
  const rows = await db
    .select({
      inspection,
      projectName: project.name,
    })
    .from(inspection)
    .innerJoin(project, eq(project.id, inspection.projectId))
    .where(and(eq(inspection.orgId, orgId), eq(inspection.id, id)))
    .limit(1)
  return rows[0] ?? null
}

export async function getNcrs(orgId: number) {
  return db
    .select({
      id: ncr.id,
      number: ncr.number,
      title: ncr.title,
      severity: ncr.severity,
      status: ncr.status,
      dueDate: ncr.dueDate,
      createdAt: ncr.createdAt,
      projectName: project.name,
    })
    .from(ncr)
    .innerJoin(project, eq(project.id, ncr.projectId))
    .where(eq(ncr.orgId, orgId))
    .orderBy(desc(ncr.createdAt))
}

export async function getDefects(orgId: number) {
  return db
    .select({
      id: defect.id,
      title: defect.title,
      location: defect.location,
      trade: defect.trade,
      status: defect.status,
      priority: defect.priority,
      createdAt: defect.createdAt,
      projectName: project.name,
    })
    .from(defect)
    .innerJoin(project, eq(project.id, defect.projectId))
    .where(eq(defect.orgId, orgId))
    .orderBy(desc(defect.createdAt))
}

export async function getDailyReports(orgId: number) {
  return db
    .select({
      id: dailyReport.id,
      reportDate: dailyReport.reportDate,
      weather: dailyReport.weather,
      manpower: dailyReport.manpower,
      summary: dailyReport.summary,
      status: dailyReport.status,
      projectName: project.name,
    })
    .from(dailyReport)
    .innerJoin(project, eq(project.id, dailyReport.projectId))
    .where(eq(dailyReport.orgId, orgId))
    .orderBy(desc(dailyReport.reportDate))
}

export async function getChecklistTemplates(orgId: number) {
  return db
    .select()
    .from(checklistTemplate)
    .where(eq(checklistTemplate.orgId, orgId))
    .orderBy(desc(checklistTemplate.createdAt))
}

export type DashboardStats = {
  projects: number
  openInspections: number
  pendingApprovals: number
  openNcrs: number
  openDefects: number
}

export async function getDashboardStats(orgId: number): Promise<DashboardStats> {
  const [p, openInsp, pending, n, d] = await Promise.all([
    db.select({ c: count() }).from(project).where(eq(project.orgId, orgId)),
    db
      .select({ c: count() })
      .from(inspection)
      .where(
        and(
          eq(inspection.orgId, orgId),
          inArray(inspection.status, ["draft", "in_review", "scheduled"]),
        ),
      ),
    db
      .select({ c: count() })
      .from(inspection)
      .where(
        and(eq(inspection.orgId, orgId), eq(inspection.status, "in_review")),
      ),
    db
      .select({ c: count() })
      .from(ncr)
      .where(and(eq(ncr.orgId, orgId), eq(ncr.status, "open"))),
    db
      .select({ c: count() })
      .from(defect)
      .where(and(eq(defect.orgId, orgId), eq(defect.status, "open"))),
  ])
  return {
    projects: p[0]?.c ?? 0,
    openInspections: openInsp[0]?.c ?? 0,
    pendingApprovals: pending[0]?.c ?? 0,
    openNcrs: n[0]?.c ?? 0,
    openDefects: d[0]?.c ?? 0,
  }
}

/** The project the dashboard focuses on — most recently created. */
export async function getPrimaryProject(orgId: number) {
  const rows = await db
    .select()
    .from(project)
    .where(eq(project.orgId, orgId))
    .orderBy(asc(project.id))
    .limit(1)
  return rows[0] ?? null
}

export async function getProgressSeries(orgId: number, projectId: number) {
  return db
    .select({
      label: progressSnapshot.label,
      planned: progressSnapshot.planned,
      actual: progressSnapshot.actual,
    })
    .from(progressSnapshot)
    .where(
      and(
        eq(progressSnapshot.orgId, orgId),
        eq(progressSnapshot.projectId, projectId),
      ),
    )
    .orderBy(asc(progressSnapshot.sortOrder))
}

export type NcrBreakdown = {
  open: number
  inReview: number
  closed: number
  total: number
}

export async function getNcrBreakdown(orgId: number): Promise<NcrBreakdown> {
  const rows = await db
    .select({ status: ncr.status, c: count() })
    .from(ncr)
    .where(eq(ncr.orgId, orgId))
    .groupBy(ncr.status)

  let open = 0
  let inReview = 0
  let closed = 0
  for (const r of rows) {
    if (r.status === "open") open += r.c
    else if (r.status === "closed" || r.status === "resolved" || r.status === "verified") closed += r.c
    else inReview += r.c
  }
  return { open, inReview, closed, total: open + inReview + closed }
}

/** Inspections still awaiting action (not approved/rejected). */
export async function getPendingInspections(orgId: number, limit = 5) {
  return db
    .select({
      id: inspection.id,
      title: inspection.title,
      discipline: inspection.discipline,
      status: inspection.status,
      priority: inspection.priority,
      scheduledFor: inspection.scheduledFor,
    })
    .from(inspection)
    .where(
      and(
        eq(inspection.orgId, orgId),
        inArray(inspection.status, ["draft", "in_review", "scheduled"]),
      ),
    )
    .orderBy(asc(inspection.scheduledFor))
    .limit(limit)
}
