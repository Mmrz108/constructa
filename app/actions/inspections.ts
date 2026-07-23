"use server"

import { db } from "@/lib/db"
import { inspection, inspectionItem } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
      status: "draft",
    })
    .returning({ id: inspection.id })

  // Seed default checklist items if provided (newline-separated).
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
        result: "pending",
        sortOrder: idx,
      })),
    )
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

  // Submitting for review requires all items resolved (not pending).
  if (to === "in_review") {
    const items = await db
      .select({ result: inspectionItem.result })
      .from(inspectionItem)
      .where(eq(inspectionItem.inspectionId, inspectionId))
    const pending = items.filter((i) => i.result === "pending").length
    if (items.length === 0) {
      throw new Error("Add at least one checklist item before submitting.")
    }
    if (pending > 0) {
      throw new Error(`${pending} checklist item(s) still pending.`)
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
