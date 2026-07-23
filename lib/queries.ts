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
  membership,
  user,
  directoryContact,
  siteVisitRequest,
  financeAccount,
  emailMessage,
  errorReport,
  projectMembership,
} from "@/lib/db/schema"
import { and, asc, desc, eq, count, inArray } from "drizzle-orm"

/** All queries are scoped by orgId — this is the tenant isolation boundary. */

export type OrgMember = {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  emailVerified: boolean
  createdAt: Date
  memberSince: Date
}

/** Members of an organization, joined to their Better Auth user record. */
export async function getOrgMembers(orgId: number): Promise<OrgMember[]> {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: membership.role,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      memberSince: membership.createdAt,
    })
    .from(membership)
    .innerJoin(user, eq(user.id, membership.userId))
    .where(eq(membership.orgId, orgId))
    .orderBy(asc(user.name))
}

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
      description: ncr.description,
      violatedStandard: ncr.violatedStandard,
      location: ncr.location,
      severity: ncr.severity,
      priority: ncr.priority,
      status: ncr.status,
      assignedTo: ncr.assignedTo,
      dueDate: ncr.dueDate,
      stageId: ncr.stageId,
      attachments: ncr.attachments,
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
      description: defect.description,
      location: defect.location,
      category: defect.category,
      trade: defect.trade,
      status: defect.status,
      priority: defect.priority,
      assignedTo: defect.assignedTo,
      stageId: defect.stageId,
      beforePhotoUrls: defect.beforePhotoUrls,
      afterPhotoUrls: defect.afterPhotoUrls,
      closeApprovedBy: defect.closeApprovedBy,
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
      workDone: dailyReport.workDone,
      tomorrowPlan: dailyReport.tomorrowPlan,
      equipment: dailyReport.equipment,
      problemsRisks: dailyReport.problemsRisks,
      incidents: dailyReport.incidents,
      photoUrls: dailyReport.photoUrls,
      supervisorSignature: dailyReport.supervisorSignature,
      status: dailyReport.status,
      stageId: dailyReport.stageId,
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

export async function getProjectMemberships(orgId: number) {
  return db
    .select({
      id: projectMembership.id,
      projectId: projectMembership.projectId,
      userId: projectMembership.userId,
      role: projectMembership.role,
      projectName: project.name,
      projectCode: project.code,
      userName: user.name,
      userEmail: user.email,
    })
    .from(projectMembership)
    .innerJoin(project, eq(project.id, projectMembership.projectId))
    .innerJoin(user, eq(user.id, projectMembership.userId))
    .where(eq(projectMembership.orgId, orgId))
    .orderBy(asc(user.name), asc(project.name))
}

export async function getUserProjectAssignments(
  orgId: number,
  userId: string,
) {
  return db
    .select({
      id: projectMembership.id,
      projectId: projectMembership.projectId,
      role: projectMembership.role,
      projectName: project.name,
    })
    .from(projectMembership)
    .innerJoin(project, eq(project.id, projectMembership.projectId))
    .where(
      and(
        eq(projectMembership.orgId, orgId),
        eq(projectMembership.userId, userId),
      ),
    )
}

export async function getOpenErrorReports(orgId: number) {
  return db
    .select({
      id: errorReport.id,
      title: errorReport.title,
      description: errorReport.description,
      status: errorReport.status,
      createdAt: errorReport.createdAt,
      projectId: errorReport.projectId,
      projectName: project.name,
      projectCode: project.code,
      projectImageUrl: project.imageUrl,
      inspectionId: errorReport.inspectionId,
    })
    .from(errorReport)
    .innerJoin(project, eq(project.id, errorReport.projectId))
    .where(and(eq(errorReport.orgId, orgId), eq(errorReport.status, "open")))
    .orderBy(desc(errorReport.createdAt))
}

export type DashboardStats = {
  projects: number
  openInspections: number
  pendingApprovals: number
  openNcrs: number
  openDefects: number
}

export type ProjectStatusBreakdown = {
  total: number
  inProgress: number
  completed: number
  rejected: number
}

export async function getProjectStatusBreakdown(
  orgId: number,
): Promise<ProjectStatusBreakdown> {
  const rows = await db
    .select({ status: project.status, c: count() })
    .from(project)
    .where(eq(project.orgId, orgId))
    .groupBy(project.status)

  let inProgress = 0
  let completed = 0
  let rejected = 0
  for (const r of rows) {
    if (r.status === "completed") completed += r.c
    else if (r.status === "archived" || r.status === "rejected") rejected += r.c
    else inProgress += r.c // active, on_hold, etc.
  }
  return {
    total: inProgress + completed + rejected,
    inProgress,
    completed,
    rejected,
  }
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

/** Latest project created in the org (for dashboard default). */
export async function getLatestProject(orgId: number) {
  const rows = await db
    .select()
    .from(project)
    .where(eq(project.orgId, orgId))
    .orderBy(desc(project.createdAt), desc(project.id))
    .limit(1)
  return rows[0] ?? null
}

/** @deprecated Prefer getLatestProject or getProject — kept for callers. */
export async function getPrimaryProject(orgId: number) {
  return getLatestProject(orgId)
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

export async function getNcrBreakdown(
  orgId: number,
  projectId?: number,
): Promise<NcrBreakdown> {
  const rows = await db
    .select({ status: ncr.status, c: count() })
    .from(ncr)
    .where(
      projectId
        ? and(eq(ncr.orgId, orgId), eq(ncr.projectId, projectId))
        : eq(ncr.orgId, orgId),
    )
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
export async function getPendingInspections(
  orgId: number,
  limit = 5,
  projectId?: number,
) {
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
        ...(projectId ? [eq(inspection.projectId, projectId)] : []),
      ),
    )
    .orderBy(asc(inspection.scheduledFor))
    .limit(limit)
}

export async function getDirectoryContacts(
  orgId: number,
  type: "client" | "contractor" | "supervisor" | "leader",
) {
  return db
    .select()
    .from(directoryContact)
    .where(
      and(eq(directoryContact.orgId, orgId), eq(directoryContact.type, type)),
    )
    .orderBy(asc(directoryContact.name))
}

export async function getSiteVisitRequests(
  orgId: number,
  status: "pending" | "approved" | "rejected",
) {
  return db
    .select()
    .from(siteVisitRequest)
    .where(
      and(eq(siteVisitRequest.orgId, orgId), eq(siteVisitRequest.status, status)),
    )
    .orderBy(desc(siteVisitRequest.createdAt))
}

export async function getFinanceAccounts(orgId: number) {
  return db
    .select()
    .from(financeAccount)
    .where(eq(financeAccount.orgId, orgId))
    .orderBy(asc(financeAccount.title))
}

export async function getEmailMessages(orgId: number) {
  return db
    .select()
    .from(emailMessage)
    .where(eq(emailMessage.orgId, orgId))
    .orderBy(desc(emailMessage.createdAt))
}
