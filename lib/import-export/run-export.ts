import "server-only"
import { db } from "@/lib/db"
import {
  checklistTemplate,
  dailyReport,
  dataTransferJob,
  defect,
  directoryContact,
  inspection,
  ipc,
  membership,
  ncr,
  organization,
  project,
  rfi,
  user,
  variationOrder,
} from "@/lib/db/schema"
import { ENTITY_META, type TransferEntity } from "@/lib/import-export/types"
import { rowsToCsv, rowsToXlsxBuffer } from "@/lib/import-export/parse"
import { and, eq } from "drizzle-orm"

function urls(v: unknown) {
  if (!Array.isArray(v)) return ""
  return v.map(String).join("|")
}

function json(v: unknown) {
  try {
    return JSON.stringify(v ?? [])
  } catch {
    return "[]"
  }
}

export async function loadExportRows(
  orgId: number,
  entity: TransferEntity,
): Promise<Record<string, unknown>[]> {
  switch (entity) {
    case "organizations": {
      const rows = await db
        .select({
          id: organization.id,
          name: organization.name,
          ownerUserId: organization.ownerUserId,
        })
        .from(organization)
        .where(eq(organization.id, orgId))
      return rows.map((r) => ({
        external_id: r.id,
        name: r.name,
        owner_email: "",
      }))
    }
    case "users": {
      const rows = await db
        .select({
          email: user.email,
          name: user.name,
          role: membership.role,
        })
        .from(membership)
        .innerJoin(user, eq(user.id, membership.userId))
        .where(eq(membership.orgId, orgId))
      return rows.map((r) => ({
        email: r.email,
        name: r.name,
        role: r.role,
        password: "",
        project_codes: "",
      }))
    }
    case "clients":
    case "contractors":
    case "subcontractors":
    case "developers":
    case "supervisors": {
      const type =
        entity === "clients"
          ? "client"
          : entity === "contractors"
            ? "contractor"
            : entity === "subcontractors"
              ? "subcontractor"
              : entity === "developers"
                ? "developer"
                : "supervisor"
      const rows = await db
        .select()
        .from(directoryContact)
        .where(
          and(eq(directoryContact.orgId, orgId), eq(directoryContact.type, type)),
        )
      return rows.map((r) => ({
        ref_code: r.refCode ?? "",
        name: r.name,
        email: r.email ?? "",
        phone: r.phone ?? "",
        notes: r.notes ?? "",
      }))
    }
    case "projects": {
      const rows = await db.select().from(project).where(eq(project.orgId, orgId))
      return rows.map((r) => ({
        code: r.code ?? "",
        name: r.name,
        client: r.client ?? "",
        location: r.location ?? "",
        status: r.status,
        description: r.description ?? "",
        contractor: r.contractor ?? "",
        consultant: r.consultant ?? "",
        image_url: r.imageUrl ?? "",
        owner_email: "",
        contractor_email: "",
        supervisor_email: "",
        developer_email: "",
      }))
    }
    case "stages": {
      const rows = await db
        .select()
        .from(checklistTemplate)
        .where(eq(checklistTemplate.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      return rows.map((r) => ({
        name: r.name,
        discipline: r.discipline ?? "",
        project_code: r.projectId ? (codeById.get(r.projectId) ?? "") : "",
        items_json: json(r.items),
        is_active: r.isActive ? "true" : "false",
      }))
    }
    case "inspections": {
      const rows = await db
        .select()
        .from(inspection)
        .where(eq(inspection.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const stages = await db
        .select({ id: checklistTemplate.id, name: checklistTemplate.name })
        .from(checklistTemplate)
        .where(eq(checklistTemplate.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      const stageById = new Map(stages.map((s) => [s.id, s.name]))
      return rows.map((r) => ({
        external_id: r.id,
        project_code: codeById.get(r.projectId) ?? "",
        stage_name: r.checklistTemplateId
          ? (stageById.get(r.checklistTemplateId) ?? "")
          : "",
        title: r.title,
        type: r.type ?? "",
        location: r.location ?? "",
        discipline: r.discipline ?? "",
        status: r.status,
        priority: r.priority ?? "",
        assigned_to: r.assignedTo ?? "",
        scheduled_for: r.scheduledFor ?? "",
        notes: r.notes ?? "",
        photo_urls: "",
      }))
    }
    case "ncrs": {
      const rows = await db.select().from(ncr).where(eq(ncr.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const stages = await db
        .select({ id: checklistTemplate.id, name: checklistTemplate.name })
        .from(checklistTemplate)
        .where(eq(checklistTemplate.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      const stageById = new Map(stages.map((s) => [s.id, s.name]))
      return rows.map((r) => ({
        number: r.number ?? "",
        project_code: codeById.get(r.projectId) ?? "",
        stage_name: r.stageId ? (stageById.get(r.stageId) ?? "") : "",
        title: r.title,
        description: r.description ?? "",
        violated_standard: r.violatedStandard ?? "",
        location: r.location ?? "",
        severity: r.severity,
        priority: r.priority,
        status: r.status,
        assigned_to: r.assignedTo ?? "",
        due_date: r.dueDate ?? "",
        attachment_urls: urls(r.attachments),
      }))
    }
    case "defects": {
      const rows = await db.select().from(defect).where(eq(defect.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const stages = await db
        .select({ id: checklistTemplate.id, name: checklistTemplate.name })
        .from(checklistTemplate)
        .where(eq(checklistTemplate.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      const stageById = new Map(stages.map((s) => [s.id, s.name]))
      return rows.map((r) => ({
        external_id: r.id,
        project_code: codeById.get(r.projectId) ?? "",
        stage_name: r.stageId ? (stageById.get(r.stageId) ?? "") : "",
        title: r.title,
        description: r.description ?? "",
        location: r.location ?? "",
        category: r.category ?? "",
        trade: r.trade ?? "",
        status: r.status,
        priority: r.priority,
        assigned_to: r.assignedTo ?? "",
        before_photo_urls: urls(r.beforePhotoUrls),
        after_photo_urls: urls(r.afterPhotoUrls),
      }))
    }
    case "daily_reports": {
      const rows = await db
        .select()
        .from(dailyReport)
        .where(eq(dailyReport.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const stages = await db
        .select({ id: checklistTemplate.id, name: checklistTemplate.name })
        .from(checklistTemplate)
        .where(eq(checklistTemplate.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      const stageById = new Map(stages.map((s) => [s.id, s.name]))
      return rows.map((r) => ({
        project_code: codeById.get(r.projectId) ?? "",
        stage_name: r.stageId ? (stageById.get(r.stageId) ?? "") : "",
        report_date: r.reportDate,
        weather: r.weather ?? "",
        manpower: r.manpower ?? "",
        summary: r.summary ?? "",
        work_done: r.workDone ?? "",
        tomorrow_plan: r.tomorrowPlan ?? "",
        equipment: r.equipment ?? "",
        problems_risks: r.problemsRisks ?? "",
        incidents: r.incidents ?? "",
        photo_urls: urls(r.photoUrls),
        status: r.status,
      }))
    }
    case "rfis": {
      const rows = await db.select().from(rfi).where(eq(rfi.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      return rows.map((r) => ({
        number: r.number ?? "",
        project_code: codeById.get(r.projectId) ?? "",
        stage_name: "",
        title: r.title,
        description: r.description ?? "",
        status: r.status,
        priority: r.priority,
        assigned_to: r.assignedTo ?? "",
        due_date: r.dueDate ?? "",
        attachment_urls: urls(r.attachments),
      }))
    }
    case "vos": {
      const rows = await db
        .select()
        .from(variationOrder)
        .where(eq(variationOrder.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      return rows.map((r) => ({
        number: r.number ?? "",
        project_code: codeById.get(r.projectId) ?? "",
        title: r.title,
        description: r.description ?? "",
        amount: r.amount ?? "",
        status: r.status,
        attachment_urls: urls(r.attachments),
      }))
    }
    case "ipcs": {
      const rows = await db.select().from(ipc).where(eq(ipc.orgId, orgId))
      const projects = await db
        .select({ id: project.id, code: project.code })
        .from(project)
        .where(eq(project.orgId, orgId))
      const codeById = new Map(projects.map((p) => [p.id, p.code ?? ""]))
      return rows.map((r) => ({
        number: r.number ?? "",
        project_code: codeById.get(r.projectId) ?? "",
        title: r.title,
        period_from: r.periodFrom ?? "",
        period_to: r.periodTo ?? "",
        amount: r.amount ?? "",
        status: r.status,
        attachment_urls: urls(r.attachments),
      }))
    }
    default:
      return []
  }
}

export async function runEntityExport(params: {
  orgId: number
  userId: string
  entity: TransferEntity
  format: "csv" | "xlsx"
}) {
  const meta = ENTITY_META[params.entity]
  const rows = await loadExportRows(params.orgId, params.entity)
  const fileBase = `bonyan-${params.entity}-${new Date().toISOString().slice(0, 10)}`

  let contentBase64: string
  let mime: string
  let fileName: string

  if (params.format === "xlsx") {
    const buf = rowsToXlsxBuffer(meta.columns, rows, params.entity)
    contentBase64 = buf.toString("base64")
    mime =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    fileName = `${fileBase}.xlsx`
  } else {
    const csv = rowsToCsv(meta.columns, rows)
    contentBase64 = Buffer.from(csv, "utf8").toString("base64")
    mime = "text/csv;charset=utf-8"
    fileName = `${fileBase}.csv`
  }

  await db.insert(dataTransferJob).values({
    orgId: params.orgId,
    userId: params.userId,
    direction: "export",
    entity: params.entity,
    source: "file",
    fileName,
    status: "completed",
    importedCount: rows.length,
    skippedCount: 0,
    errorCount: 0,
    report: {
      entity: params.entity,
      totalRows: rows.length,
      format: params.format,
      exportedAt: new Date().toISOString(),
    },
  })

  return { fileName, mime, contentBase64, rowCount: rows.length }
}
