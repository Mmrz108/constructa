import "server-only"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  checklistTemplate,
  dailyReport,
  dataTransferJob,
  defect,
  directoryContact,
  inspection,
  ipc,
  ncr,
  organization,
  project,
  projectMembership,
  rfi,
  user,
  variationOrder,
} from "@/lib/db/schema"
import {
  DEFAULT_IMPORT_OPTIONS,
  type ImportOptions,
  type RowResult,
  type TransferEntity,
  type TransferReport,
} from "@/lib/import-export/types"
import {
  parseJsonArray,
  sanitizeEmail,
  sanitizeText,
  sanitizeUrlList,
} from "@/lib/import-export/security"
import {
  ensureMembership,
  findUserIdByEmail,
  loadResolveMaps,
  refreshProjectMap,
  resolveProjectId,
  resolveStageId,
  resolveUserId,
  type ImportResolveMaps,
} from "@/lib/import-export/resolve"
import { isOrgRole, normalizeRole } from "@/lib/roles"
import { and, eq } from "drizzle-orm"

type Ctx = {
  orgId: number
  userId: string
  maps: ImportResolveMaps
  upsert: boolean
}

function cell(row: Record<string, string>, ...keys: string[]) {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim() !== "") return sanitizeText(v)
  }
  return ""
}

async function importDirectory(
  ctx: Ctx,
  rows: Record<string, string>[],
  type: string,
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const name = cell(row, "name")
    const email = sanitizeEmail(cell(row, "email"))
    const refCode = cell(row, "ref_code", "refcode")
    const phone = cell(row, "phone")
    const notes = cell(row, "notes")

    if (!name) {
      results.push({ row: rowNum, status: "error", message: "name is required" })
      continue
    }

    try {
      const existing = await db
        .select()
        .from(directoryContact)
        .where(eq(directoryContact.orgId, ctx.orgId))

      const dup = existing.find(
        (e) =>
          e.type === type &&
          ((email && e.email?.toLowerCase() === email) ||
            (refCode && e.refCode === refCode) ||
            (!email && !refCode && e.name.toLowerCase() === name.toLowerCase())),
      )

      if (dup) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: email || refCode || name,
            message: "Duplicate contact skipped",
          })
          continue
        }
        await db
          .update(directoryContact)
          .set({ name, email: email || null, phone: phone || null, refCode: refCode || null, notes: notes || null })
          .where(eq(directoryContact.id, dup.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: email || refCode || name,
          message: "Contact updated",
        })
      } else {
        await db.insert(directoryContact).values({
          orgId: ctx.orgId,
          type,
          name,
          email: email || null,
          phone: phone || null,
          refCode: refCode || null,
          notes: notes || null,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: email || refCode || name,
          message: "Contact imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        message: err instanceof Error ? err.message : "Import failed",
      })
    }
  }
}

async function importOrganizations(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const name = cell(row, "name")
    const ownerEmail = sanitizeEmail(cell(row, "owner_email"))
    if (!name) {
      results.push({ row: rowNum, status: "error", message: "name is required" })
      continue
    }
    try {
      const current = await db
        .select()
        .from(organization)
        .where(eq(organization.id, ctx.orgId))
        .limit(1)

      if (current[0] && current[0].name.toLowerCase() === name.toLowerCase()) {
        await db.update(organization).set({ name }).where(eq(organization.id, ctx.orgId))
        results.push({
          row: rowNum,
          status: "updated",
          key: name,
          message: "Current organization updated",
        })
        continue
      }

      const ownerId =
        (ownerEmail ? await findUserIdByEmail(ownerEmail) : null) ?? ctx.userId

      const created = await db
        .insert(organization)
        .values({ name, ownerUserId: ownerId })
        .returning({ id: organization.id })

      await ensureMembership(ownerId, created[0].id, "admin")
      results.push({
        row: rowNum,
        status: "imported",
        key: name,
        message: `Organization created (id=${created[0].id})`,
      })
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        message: err instanceof Error ? err.message : "Import failed",
      })
    }
  }
}

async function importUsers(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const email = sanitizeEmail(cell(row, "email"))
    const name = cell(row, "name") || email
    const role = normalizeRole(cell(row, "role") || "supervisor")
    const password = cell(row, "password") || "ChangeMe123!"
    const projectCodes = cell(row, "project_codes", "project_code")

    if (!email || !email.includes("@")) {
      results.push({ row: rowNum, status: "error", message: "Valid email required" })
      continue
    }
    if (!isOrgRole(role)) {
      results.push({ row: rowNum, status: "error", message: "Invalid role" })
      continue
    }

    try {
      let userId = await findUserIdByEmail(email)
      let status: RowResult["status"] = "imported"

      if (userId) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: email,
            message: "User already exists",
          })
          continue
        }
        await db.update(user).set({ name }).where(eq(user.id, userId))
        status = "updated"
      } else {
        if (password.length < 8) {
          results.push({
            row: rowNum,
            status: "error",
            key: email,
            message: "Password must be at least 8 characters",
          })
          continue
        }
        const created = await auth.api.signUpEmail({
          body: { name, email, password },
        })
        userId = created.user.id
      }

      await ensureMembership(userId!, ctx.orgId, role)
      ctx.maps.userByEmail.set(email, userId!)

      if (projectCodes) {
        for (const code of projectCodes.split(/[|;,]/).map((s) => s.trim()).filter(Boolean)) {
          const projectId = resolveProjectId(ctx.maps, code)
          if (!projectId) continue
          const existing = await db
            .select({ id: projectMembership.id })
            .from(projectMembership)
            .where(
              and(
                eq(projectMembership.orgId, ctx.orgId),
                eq(projectMembership.projectId, projectId),
                eq(projectMembership.userId, userId!),
                eq(projectMembership.role, role),
              ),
            )
            .limit(1)
          if (!existing[0]) {
            await db.insert(projectMembership).values({
              orgId: ctx.orgId,
              projectId,
              userId: userId!,
              role,
            })
          }
        }
      }

      results.push({
        row: rowNum,
        status,
        key: email,
        message: status === "updated" ? "User updated" : "User imported",
      })
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: email,
        message: err instanceof Error ? err.message : "User import failed",
      })
    }
  }
}

async function importProjects(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const code = cell(row, "code").toUpperCase()
    const name = cell(row, "name")
    if (!name) {
      results.push({ row: rowNum, status: "error", message: "name is required" })
      continue
    }

    const values = {
      name,
      code: code || null,
      client: cell(row, "client") || null,
      location: cell(row, "location") || null,
      status: cell(row, "status") || "active",
      description: cell(row, "description") || null,
      contractor: cell(row, "contractor") || null,
      consultant: cell(row, "consultant") || null,
      imageUrl: sanitizeUrlList(cell(row, "image_url"))[0] ?? null,
      ownerUserId: resolveUserId(ctx.maps, cell(row, "owner_email")),
      contractorUserId: resolveUserId(ctx.maps, cell(row, "contractor_email")),
      supervisorUserId: resolveUserId(ctx.maps, cell(row, "supervisor_email")),
      developerUserId: resolveUserId(ctx.maps, cell(row, "developer_email")),
    }

    try {
      const existingId = code ? resolveProjectId(ctx.maps, code) : null
      if (existingId) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: code,
            message: "Duplicate project code skipped",
          })
          continue
        }
        await db.update(project).set(values).where(eq(project.id, existingId))
        results.push({
          row: rowNum,
          status: "updated",
          key: code || name,
          message: "Project updated",
        })
      } else {
        const inserted = await db
          .insert(project)
          .values({
            orgId: ctx.orgId,
            userId: ctx.userId,
            ...values,
          })
          .returning({ id: project.id, code: project.code })
        if (inserted[0]?.code) {
          ctx.maps.projectByCode.set(inserted[0].code.toUpperCase(), inserted[0].id)
        }
        results.push({
          row: rowNum,
          status: "imported",
          key: code || name,
          message: "Project imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: code || name,
        message: err instanceof Error ? err.message : "Project import failed",
      })
    }
  }
  await refreshProjectMap(ctx.maps, ctx.orgId)
}

async function importStages(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const name = cell(row, "name")
    if (!name) {
      results.push({ row: rowNum, status: "error", message: "name is required" })
      continue
    }
    const projectCode = cell(row, "project_code")
    const projectId = projectCode ? resolveProjectId(ctx.maps, projectCode) : null
    if (projectCode && !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        key: name,
        message: `Unknown project_code: ${projectCode}`,
      })
      continue
    }

    const items = parseJsonArray(cell(row, "items_json", "items"))
    const discipline = cell(row, "discipline") || "Structural"
    const isActive = !["false", "0", "no"].includes(cell(row, "is_active").toLowerCase())

    try {
      const existingId = resolveStageId(ctx.maps, name, projectId)
      if (existingId) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: name,
            message: "Duplicate stage skipped",
          })
          continue
        }
        await db
          .update(checklistTemplate)
          .set({
            items,
            discipline,
            isActive,
            projectId: projectId ?? undefined,
          })
          .where(eq(checklistTemplate.id, existingId))
        results.push({
          row: rowNum,
          status: "updated",
          key: name,
          message: "Stage updated",
        })
      } else {
        const inserted = await db
          .insert(checklistTemplate)
          .values({
            orgId: ctx.orgId,
            userId: ctx.userId,
            name,
            discipline,
            items,
            isActive,
            projectId: projectId ?? null,
          })
          .returning({ id: checklistTemplate.id })
        const id = inserted[0].id
        ctx.maps.stageByKey.set(`0:${name.toLowerCase()}`, id)
        if (projectId) ctx.maps.stageByKey.set(`${projectId}:${name.toLowerCase()}`, id)
        results.push({
          row: rowNum,
          status: "imported",
          key: name,
          message: "Stage imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: name,
        message: err instanceof Error ? err.message : "Stage import failed",
      })
    }
  }
}

async function importInspections(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const stageId = resolveStageId(ctx.maps, cell(row, "stage_name"), projectId)
    const externalId = cell(row, "external_id")
    const notesExtra = [
      cell(row, "notes"),
      externalId ? `external_id=${externalId}` : "",
      sanitizeUrlList(cell(row, "photo_urls")).length
        ? `photos=${sanitizeUrlList(cell(row, "photo_urls")).join("|")}`
        : "",
    ]
      .filter(Boolean)
      .join(" | ")

    try {
      const existing = externalId
        ? await db
            .select({ id: inspection.id })
            .from(inspection)
            .where(
              and(
                eq(inspection.orgId, ctx.orgId),
                eq(inspection.projectId, projectId),
                eq(inspection.notes, notesExtra),
              ),
            )
            .limit(1)
        : []

      // Prefer match by title+project when external missing
      const byTitle =
        existing[0] ??
        (
          await db
            .select({ id: inspection.id })
            .from(inspection)
            .where(
              and(
                eq(inspection.orgId, ctx.orgId),
                eq(inspection.projectId, projectId),
                eq(inspection.title, title),
              ),
            )
            .limit(1)
        )[0]

      const scheduledRaw = cell(row, "scheduled_for")
      const scheduledFor = scheduledRaw
        ? (() => {
            const d = new Date(scheduledRaw)
            return Number.isNaN(d.getTime()) ? null : d
          })()
        : null

      const payload = {
        title,
        type: cell(row, "type") || "site",
        location: cell(row, "location") || null,
        discipline: cell(row, "discipline") || null,
        status: cell(row, "status") || "draft",
        priority: cell(row, "priority") || "medium",
        assignedTo: cell(row, "assigned_to") || null,
        scheduledFor,
        notes: notesExtra || null,
        checklistTemplateId: stageId,
      }

      if (byTitle) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: title,
            message: "Duplicate inspection skipped",
          })
          continue
        }
        await db.update(inspection).set(payload).where(eq(inspection.id, byTitle.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: externalId || title,
          message: "Inspection updated",
        })
      } else {
        await db.insert(inspection).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: externalId || title,
          message: "Inspection imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: title,
        message: err instanceof Error ? err.message : "Inspection import failed",
      })
    }
  }
}

async function importNcrs(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const number = cell(row, "number")
    const stageId = resolveStageId(ctx.maps, cell(row, "stage_name"), projectId)
    const attachments = sanitizeUrlList(cell(row, "attachment_urls", "attachments"))

    try {
      let existing =
        number
          ? (
              await db
                .select({ id: ncr.id })
                .from(ncr)
                .where(
                  and(
                    eq(ncr.orgId, ctx.orgId),
                    eq(ncr.projectId, projectId),
                    eq(ncr.number, number),
                  ),
                )
                .limit(1)
            )[0]
          : undefined

      const payload = {
        number: number || null,
        title,
        description: cell(row, "description") || null,
        violatedStandard: cell(row, "violated_standard") || null,
        location: cell(row, "location") || null,
        severity: cell(row, "severity") || "minor",
        priority: cell(row, "priority") || "medium",
        status: cell(row, "status") || "open",
        assignedTo: cell(row, "assigned_to") || null,
        dueDate: cell(row, "due_date") || null,
        stageId,
        attachments,
        updatedAt: new Date(),
      }

      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: number || title,
            message: "Duplicate NCR skipped",
          })
          continue
        }
        await db.update(ncr).set(payload).where(eq(ncr.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: number || title,
          message: "NCR updated",
        })
      } else {
        await db.insert(ncr).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: number || title,
          message: "NCR imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: number || title,
        message: err instanceof Error ? err.message : "NCR import failed",
      })
    }
  }
}

async function importDefects(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const externalId = cell(row, "external_id")
    const stageId = resolveStageId(ctx.maps, cell(row, "stage_name"), projectId)
    const payload = {
      title,
      description: [
        cell(row, "description"),
        externalId ? `external_id=${externalId}` : "",
      ]
        .filter(Boolean)
        .join(" | ") || null,
      location: cell(row, "location") || null,
      category: cell(row, "category") || null,
      trade: cell(row, "trade") || null,
      status: cell(row, "status") || "open",
      priority: cell(row, "priority") || "medium",
      assignedTo: cell(row, "assigned_to") || null,
      stageId,
      beforePhotoUrls: sanitizeUrlList(cell(row, "before_photo_urls")),
      afterPhotoUrls: sanitizeUrlList(cell(row, "after_photo_urls")),
    }

    try {
      const existing = (
        await db
          .select({ id: defect.id, description: defect.description })
          .from(defect)
          .where(
            and(eq(defect.orgId, ctx.orgId), eq(defect.projectId, projectId), eq(defect.title, title)),
          )
          .limit(5)
      ).find((d) =>
        externalId ? (d.description ?? "").includes(`external_id=${externalId}`) : true,
      )

      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: title,
            message: "Duplicate defect skipped",
          })
          continue
        }
        await db.update(defect).set(payload).where(eq(defect.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: externalId || title,
          message: "Defect updated",
        })
      } else {
        await db.insert(defect).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: externalId || title,
          message: "Defect imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: title,
        message: err instanceof Error ? err.message : "Defect import failed",
      })
    }
  }
}

async function importDailyReports(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const projectCode = cell(row, "project_code")
    const reportDate = cell(row, "report_date")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!projectId || !reportDate) {
      results.push({
        row: rowNum,
        status: "error",
        message: !projectId
          ? `Unknown project_code: ${projectCode}`
          : "report_date required",
      })
      continue
    }
    const stageId = resolveStageId(ctx.maps, cell(row, "stage_name"), projectId)
    const manpowerRaw = cell(row, "manpower")
    const payload = {
      reportDate,
      weather: cell(row, "weather") || null,
      manpower: manpowerRaw ? Number(manpowerRaw) || null : null,
      summary: cell(row, "summary") || null,
      workDone: cell(row, "work_done") || null,
      tomorrowPlan: cell(row, "tomorrow_plan") || null,
      equipment: cell(row, "equipment") || null,
      problemsRisks: cell(row, "problems_risks") || null,
      incidents: cell(row, "incidents") || null,
      photoUrls: sanitizeUrlList(cell(row, "photo_urls")),
      status: cell(row, "status") || "draft",
      stageId,
    }

    try {
      const existing = (
        await db
          .select({ id: dailyReport.id })
          .from(dailyReport)
          .where(
            and(
              eq(dailyReport.orgId, ctx.orgId),
              eq(dailyReport.projectId, projectId),
              eq(dailyReport.reportDate, reportDate),
            ),
          )
          .limit(1)
      )[0]

      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: `${projectCode}:${reportDate}`,
            message: "Duplicate daily report skipped",
          })
          continue
        }
        await db.update(dailyReport).set(payload).where(eq(dailyReport.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: `${projectCode}:${reportDate}`,
          message: "Daily report updated",
        })
      } else {
        await db.insert(dailyReport).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: `${projectCode}:${reportDate}`,
          message: "Daily report imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: `${projectCode}:${reportDate}`,
        message: err instanceof Error ? err.message : "Daily report import failed",
      })
    }
  }
}

async function importRfis(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const number = cell(row, "number")
    const stageId = resolveStageId(ctx.maps, cell(row, "stage_name"), projectId)
    const payload = {
      number: number || null,
      title,
      description: cell(row, "description") || null,
      status: cell(row, "status") || "open",
      priority: cell(row, "priority") || "medium",
      assignedTo: cell(row, "assigned_to") || null,
      dueDate: cell(row, "due_date") || null,
      stageId,
      attachments: sanitizeUrlList(cell(row, "attachment_urls")),
      updatedAt: new Date(),
    }
    try {
      const existing = number
        ? (
            await db
              .select({ id: rfi.id })
              .from(rfi)
              .where(
                and(eq(rfi.orgId, ctx.orgId), eq(rfi.projectId, projectId), eq(rfi.number, number)),
              )
              .limit(1)
          )[0]
        : undefined
      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: number || title,
            message: "Duplicate RFI skipped",
          })
          continue
        }
        await db.update(rfi).set(payload).where(eq(rfi.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: number || title,
          message: "RFI updated",
        })
      } else {
        await db.insert(rfi).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: number || title,
          message: "RFI imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: number || title,
        message: err instanceof Error ? err.message : "RFI import failed",
      })
    }
  }
}

async function importVos(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const number = cell(row, "number")
    const payload = {
      number: number || null,
      title,
      description: cell(row, "description") || null,
      amount: cell(row, "amount") || null,
      status: cell(row, "status") || "draft",
      attachments: sanitizeUrlList(cell(row, "attachment_urls")),
      updatedAt: new Date(),
    }
    try {
      const existing = number
        ? (
            await db
              .select({ id: variationOrder.id })
              .from(variationOrder)
              .where(
                and(
                  eq(variationOrder.orgId, ctx.orgId),
                  eq(variationOrder.projectId, projectId),
                  eq(variationOrder.number, number),
                ),
              )
              .limit(1)
          )[0]
        : undefined
      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: number || title,
            message: "Duplicate VO skipped",
          })
          continue
        }
        await db
          .update(variationOrder)
          .set(payload)
          .where(eq(variationOrder.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: number || title,
          message: "VO updated",
        })
      } else {
        await db.insert(variationOrder).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: number || title,
          message: "VO imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: number || title,
        message: err instanceof Error ? err.message : "VO import failed",
      })
    }
  }
}

async function importIpcs(
  ctx: Ctx,
  rows: Record<string, string>[],
  results: RowResult[],
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2
    const title = cell(row, "title")
    const projectCode = cell(row, "project_code")
    const projectId = resolveProjectId(ctx.maps, projectCode)
    if (!title || !projectId) {
      results.push({
        row: rowNum,
        status: "error",
        message: !title ? "title required" : `Unknown project_code: ${projectCode}`,
      })
      continue
    }
    const number = cell(row, "number")
    const payload = {
      number: number || null,
      title,
      periodFrom: cell(row, "period_from") || null,
      periodTo: cell(row, "period_to") || null,
      amount: cell(row, "amount") || null,
      status: cell(row, "status") || "draft",
      attachments: sanitizeUrlList(cell(row, "attachment_urls")),
      updatedAt: new Date(),
    }
    try {
      const existing = number
        ? (
            await db
              .select({ id: ipc.id })
              .from(ipc)
              .where(
                and(eq(ipc.orgId, ctx.orgId), eq(ipc.projectId, projectId), eq(ipc.number, number)),
              )
              .limit(1)
          )[0]
        : undefined
      if (existing) {
        if (!ctx.upsert) {
          results.push({
            row: rowNum,
            status: "skipped",
            key: number || title,
            message: "Duplicate IPC skipped",
          })
          continue
        }
        await db.update(ipc).set(payload).where(eq(ipc.id, existing.id))
        results.push({
          row: rowNum,
          status: "updated",
          key: number || title,
          message: "IPC updated",
        })
      } else {
        await db.insert(ipc).values({
          orgId: ctx.orgId,
          projectId,
          userId: ctx.userId,
          ...payload,
        })
        results.push({
          row: rowNum,
          status: "imported",
          key: number || title,
          message: "IPC imported",
        })
      }
    } catch (err) {
      results.push({
        row: rowNum,
        status: "error",
        key: number || title,
        message: err instanceof Error ? err.message : "IPC import failed",
      })
    }
  }
}

export async function runEntityImport(params: {
  orgId: number
  userId: string
  entity: TransferEntity
  rows: Record<string, string>[]
  fileName?: string
  options?: Partial<ImportOptions>
}): Promise<TransferReport> {
  const opts = { ...DEFAULT_IMPORT_OPTIONS, ...params.options }
  const startedAt = new Date().toISOString()
  const rows = params.rows.slice(0, opts.maxRows)
  const results: RowResult[] = []
  const maps = await loadResolveMaps(params.orgId)
  const ctx: Ctx = {
    orgId: params.orgId,
    userId: params.userId,
    maps,
    upsert: opts.upsert,
  }

  switch (params.entity) {
    case "organizations":
      await importOrganizations(ctx, rows, results)
      break
    case "users":
      await importUsers(ctx, rows, results)
      break
    case "clients":
      await importDirectory(ctx, rows, "client", results)
      break
    case "contractors":
      await importDirectory(ctx, rows, "contractor", results)
      break
    case "subcontractors":
      await importDirectory(ctx, rows, "subcontractor", results)
      break
    case "developers":
      await importDirectory(ctx, rows, "developer", results)
      break
    case "supervisors":
      await importDirectory(ctx, rows, "supervisor", results)
      break
    case "projects":
      await importProjects(ctx, rows, results)
      break
    case "stages":
      await importStages(ctx, rows, results)
      break
    case "inspections":
      await importInspections(ctx, rows, results)
      break
    case "ncrs":
      await importNcrs(ctx, rows, results)
      break
    case "defects":
      await importDefects(ctx, rows, results)
      break
    case "daily_reports":
      await importDailyReports(ctx, rows, results)
      break
    case "rfis":
      await importRfis(ctx, rows, results)
      break
    case "vos":
      await importVos(ctx, rows, results)
      break
    case "ipcs":
      await importIpcs(ctx, rows, results)
      break
    default:
      results.push({
        row: 0,
        status: "error",
        message: `Unsupported entity: ${params.entity}`,
      })
  }

  const imported = results.filter((r) => r.status === "imported").length
  const updated = results.filter((r) => r.status === "updated").length
  const skipped = results.filter((r) => r.status === "skipped").length
  const errors = results.filter((r) => r.status === "error").length
  const finishedAt = new Date().toISOString()

  const report: TransferReport = {
    entity: params.entity,
    fileName: params.fileName,
    totalRows: rows.length,
    imported,
    updated,
    skipped,
    errors,
    rows: results,
    startedAt,
    finishedAt,
  }

  const jobStatus =
    errors === 0 ? "completed" : imported + updated > 0 ? "partial" : "failed"

  await db.insert(dataTransferJob).values({
    orgId: params.orgId,
    userId: params.userId,
    direction: "import",
    entity: params.entity,
    source: "file",
    fileName: params.fileName ?? null,
    status: jobStatus,
    importedCount: imported + updated,
    skippedCount: skipped,
    errorCount: errors,
    report,
  })

  return report
}
