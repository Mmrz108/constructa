"use server"

import { db } from "@/lib/db"
import {
  checklistTemplate,
  errorReport,
  inspection,
  inspectionItem,
} from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import {
  isItemAnswered,
  normalizeStageQuestions,
} from "@/lib/stage-form"
import { and, eq } from "drizzle-orm"
import { mkdir, writeFile } from "fs/promises"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import path from "path"

/** Valid inspection status transitions (workflow guardrails). */
const transitions: Record<string, string[]> = {
  draft: ["in_review"],
  in_review: ["approved", "rejected"],
  rejected: ["in_review"],
  approved: [],
}

async function ownedInspection(orgId: number, id: number) {
  const rows = await db
    .select()
    .from(inspection)
    .where(and(eq(inspection.orgId, orgId), eq(inspection.id, id)))
    .limit(1)
  return rows[0] ?? null
}

export async function createInspection(formData: FormData) {
  const { orgId, user } = await requireContext()
  const title = String(formData.get("title") ?? "").trim()
  const projectId = Number(formData.get("projectId"))
  if (!title) throw new Error("Title is required")
  if (!projectId) throw new Error("Project is required")

  const scheduledRaw = String(formData.get("scheduledFor") ?? "").trim()
  const stageId = Number(formData.get("stageId"))

  let templateId: number | null = null
  let seededFromStage = false

  const [row] = await db
    .insert(inspection)
    .values({
      orgId,
      userId: user.id,
      projectId,
      title,
      type: String(formData.get("type") ?? "quality"),
      discipline: String(formData.get("discipline") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      priority: String(formData.get("priority") ?? "medium"),
      scheduledFor: scheduledRaw ? new Date(scheduledRaw) : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      checklistTemplateId: stageId || null,
      status: "draft",
    })
    .returning({ id: inspection.id })

  if (stageId) {
    const [stage] = await db
      .select()
      .from(checklistTemplate)
      .where(
        and(
          eq(checklistTemplate.id, stageId),
          eq(checklistTemplate.orgId, orgId),
          eq(checklistTemplate.isActive, true),
        ),
      )
      .limit(1)

    if (stage) {
      if (stage.projectId && stage.projectId !== projectId) {
        throw new Error("Selected stage belongs to another project")
      }
      templateId = stage.id
      const questions = normalizeStageQuestions(stage.items)
      if (questions.length > 0) {
        seededFromStage = true
        await db.insert(inspectionItem).values(
          questions.map((q, idx) => ({
            inspectionId: row.id,
            userId: user.id,
            label: q.label,
            result: "pending" as const,
            sortOrder: idx,
            questionType: q.type,
            answer: null,
            photoUrls: [],
            options: q.options ?? [],
            requirePhoto: Boolean(q.requirePhoto) || q.type === "photo",
            allowText: q.allowText !== false || q.type === "text",
          })),
        )
      }
      await db
        .update(inspection)
        .set({ checklistTemplateId: templateId })
        .where(eq(inspection.id, row.id))
    }
  }

  if (!seededFromStage) {
    const rawItems = String(formData.get("checklist") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    if (rawItems.length > 0) {
      await db.insert(inspectionItem).values(
        rawItems.map((label, idx) => ({
          inspectionId: row.id,
          userId: user.id,
          label,
          result: "pending" as const,
          sortOrder: idx,
          questionType: "pass_fail",
          photoUrls: [],
          options: [],
          requirePhoto: false,
          allowText: true,
        })),
      )
    }
  }

  revalidatePath("/inspections")
  revalidatePath("/")
  redirect(`/inspections/${row.id}`)
}

export async function addChecklistItem(inspectionId: number, label: string) {
  const { orgId, user } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")
  if (!label.trim()) throw new Error("Item label required")

  const existing = await db
    .select({ id: inspectionItem.id })
    .from(inspectionItem)
    .where(eq(inspectionItem.inspectionId, inspectionId))

  await db.insert(inspectionItem).values({
    inspectionId,
    userId: user.id,
    label: label.trim(),
    result: "pending",
    sortOrder: existing.length,
    questionType: "pass_fail",
    photoUrls: [],
    options: [],
    requirePhoto: false,
    allowText: true,
  })
  revalidatePath(`/inspections/${inspectionId}`)
}

export async function setItemResult(
  itemId: number,
  inspectionId: number,
  result: "pass" | "fail" | "na" | "pending",
  comment?: string,
) {
  const { orgId } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")

  await db
    .update(inspectionItem)
    .set({ result, comment: comment ?? null })
    .where(
      and(
        eq(inspectionItem.id, itemId),
        eq(inspectionItem.inspectionId, inspectionId),
      ),
    )
  revalidatePath(`/inspections/${inspectionId}`)
}

export async function saveItemAnswer(
  itemId: number,
  inspectionId: number,
  payload: {
    result?: "pass" | "fail" | "na" | "pending"
    answer?: unknown
    comment?: string | null
  },
) {
  const { orgId } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")
  if (!(insp.status === "draft" || insp.status === "rejected")) {
    throw new Error("Inspection is locked")
  }

  const patch: {
    result?: string
    answer?: unknown
    comment?: string | null
  } = {}
  if (payload.result !== undefined) patch.result = payload.result
  if (payload.answer !== undefined) patch.answer = payload.answer
  if (payload.comment !== undefined) patch.comment = payload.comment

  await db
    .update(inspectionItem)
    .set(patch)
    .where(
      and(
        eq(inspectionItem.id, itemId),
        eq(inspectionItem.inspectionId, inspectionId),
      ),
    )
  revalidatePath(`/inspections/${inspectionId}`)
}

export async function uploadItemPhoto(
  itemId: number,
  inspectionId: number,
  formData: FormData,
) {
  const { orgId } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")
  if (!(insp.status === "draft" || insp.status === "rejected")) {
    throw new Error("Inspection is locked")
  }

  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("A photo file is required")
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Photo must be under 8 MB")
  }
  const type = file.type || ""
  if (!type.startsWith("image/")) {
    throw new Error("Only image files are allowed")
  }

  const [item] = await db
    .select()
    .from(inspectionItem)
    .where(
      and(
        eq(inspectionItem.id, itemId),
        eq(inspectionItem.inspectionId, inspectionId),
      ),
    )
    .limit(1)
  if (!item) throw new Error("Checklist item not found")

  const ext =
    type === "image/png"
      ? "png"
      : type === "image/webp"
        ? "webp"
        : type === "image/gif"
          ? "gif"
          : "jpg"

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "inspections",
    String(inspectionId),
  )
  await mkdir(dir, { recursive: true })
  const filename = `${itemId}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)

  const url = `/uploads/inspections/${inspectionId}/${filename}`
  const existing = Array.isArray(item.photoUrls)
    ? (item.photoUrls as string[])
    : []
  const photoUrls = [...existing, url]

  await db
    .update(inspectionItem)
    .set({
      photoUrls,
      result: item.questionType === "photo" ? "pass" : item.result,
    })
    .where(eq(inspectionItem.id, itemId))

  revalidatePath(`/inspections/${inspectionId}`)
  return url
}

export async function deleteChecklistItem(
  itemId: number,
  inspectionId: number,
) {
  const { orgId } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")
  await db
    .delete(inspectionItem)
    .where(
      and(
        eq(inspectionItem.id, itemId),
        eq(inspectionItem.inspectionId, inspectionId),
      ),
    )
  revalidatePath(`/inspections/${inspectionId}`)
}

export async function transitionInspection(
  inspectionId: number,
  to: string,
) {
  const { orgId } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")

  const allowed = transitions[insp.status] ?? []
  if (!allowed.includes(to)) {
    throw new Error(`Cannot move from "${insp.status}" to "${to}".`)
  }

  if (to === "in_review") {
    const items = await db
      .select()
      .from(inspectionItem)
      .where(eq(inspectionItem.inspectionId, inspectionId))
    if (items.length === 0) {
      throw new Error("Add at least one checklist item before submitting.")
    }
    const unanswered = items.filter((i) => !isItemAnswered(i)).length
    if (unanswered > 0) {
      throw new Error(`${unanswered} question(s) still unanswered.`)
    }
  }

  await db
    .update(inspection)
    .set({ status: to, updatedAt: new Date() })
    .where(and(eq(inspection.id, inspectionId), eq(inspection.orgId, orgId)))

  revalidatePath(`/inspections/${inspectionId}`)
  revalidatePath("/inspections")
  revalidatePath("/")
}

export async function submitErrorReport(
  inspectionId: number,
  description: string,
) {
  const { orgId, user } = await requireContext()
  const insp = await ownedInspection(orgId, inspectionId)
  if (!insp) throw new Error("Inspection not found")

  const desc = description.trim()
  if (!desc) throw new Error("Error description is required")

  const items = await db
    .select()
    .from(inspectionItem)
    .where(eq(inspectionItem.inspectionId, inspectionId))

  if (items.length === 0) {
    throw new Error("Complete the inspection form before reporting an error")
  }
  const unanswered = items.filter((i) => !isItemAnswered(i))
  if (unanswered.length > 0) {
    throw new Error(
      `Answer all questions first (${unanswered.length} remaining)`,
    )
  }

  await db.insert(errorReport).values({
    orgId,
    projectId: insp.projectId,
    inspectionId,
    userId: user.id,
    title: `Error · ${insp.title}`,
    description: desc,
    status: "open",
  })

  // Move inspection into review so the report is visible in workflow.
  if (insp.status === "draft" || insp.status === "rejected") {
    await db
      .update(inspection)
      .set({ status: "in_review", updatedAt: new Date(), notes: desc })
      .where(eq(inspection.id, inspectionId))
  }

  revalidatePath(`/inspections/${inspectionId}`)
  revalidatePath("/inspections")
  revalidatePath("/")
}

export async function resolveErrorReport(id: number) {
  const { orgId } = await requireContext()
  await db
    .update(errorReport)
    .set({ status: "resolved" })
    .where(and(eq(errorReport.id, id), eq(errorReport.orgId, orgId)))
  revalidatePath("/")
}
