"use server"

import { db } from "@/lib/db"
import { defect } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { saveUploadedFiles } from "@/lib/uploads"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Defect / snag lifecycle — trackable until closed (with close approval). */
const transitions: Record<string, string[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["fixed", "open"],
  fixed: ["verified", "in_progress"],
  verified: ["closed", "in_progress"],
  closed: [],
}

export async function createDefect(formData: FormData) {
  const { orgId, user, role } = await requireContext()
  const { getOrgSettings, assertCan } = await import("@/lib/settings")
  assertCan(role, "defects", "create", (await getOrgSettings(orgId)).permissions)

  const title = String(formData.get("title") ?? "").trim()
  const projectId = Number(formData.get("projectId"))
  if (!title) throw new Error("Title is required")
  if (!projectId) throw new Error("Project is required")

  const stageRaw = String(formData.get("stageId") ?? "").trim()
  const stageId = stageRaw ? Number(stageRaw) : null

  const beforePhotoUrls = await saveUploadedFiles(
    formData,
    "beforePhotos",
    `defects/${orgId}/before`,
  )
  const afterPhotoUrls = await saveUploadedFiles(
    formData,
    "afterPhotos",
    `defects/${orgId}/after`,
  )

  await db.insert(defect).values({
    orgId,
    userId: user.id,
    projectId,
    stageId: stageId || null,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    trade: String(formData.get("trade") ?? "").trim() || null,
    priority: String(formData.get("priority") ?? "medium"),
    assignedTo: String(formData.get("assignedTo") ?? "").trim() || null,
    beforePhotoUrls,
    afterPhotoUrls,
    status: "open",
  })

  revalidatePath("/defects")
  revalidatePath("/")
}

export async function transitionDefect(id: number, to: string) {
  const { orgId, user } = await requireContext()
  const rows = await db
    .select()
    .from(defect)
    .where(and(eq(defect.id, id), eq(defect.orgId, orgId)))
    .limit(1)
  const current = rows[0]
  if (!current) throw new Error("Defect not found")

  const allowed = transitions[current.status] ?? []
  if (!allowed.includes(to)) {
    throw new Error(`Cannot move from "${current.status}" to "${to}".`)
  }

  const patch: {
    status: string
    closeApprovedBy?: string | null
    closeApprovedAt?: Date | null
  } = { status: to }

  if (to === "closed") {
    patch.closeApprovedBy = user.id
    patch.closeApprovedAt = new Date()
  }

  await db
    .update(defect)
    .set(patch)
    .where(and(eq(defect.id, id), eq(defect.orgId, orgId)))

  revalidatePath("/defects")
  revalidatePath("/")
}

export async function addDefectAfterPhotos(id: number, formData: FormData) {
  const { orgId } = await requireContext()
  const rows = await db
    .select()
    .from(defect)
    .where(and(eq(defect.id, id), eq(defect.orgId, orgId)))
    .limit(1)
  const current = rows[0]
  if (!current) throw new Error("Defect not found")

  const uploaded = await saveUploadedFiles(
    formData,
    "afterPhotos",
    `defects/${orgId}/after`,
  )
  const existing = Array.isArray(current.afterPhotoUrls)
    ? (current.afterPhotoUrls as string[])
    : []

  await db
    .update(defect)
    .set({ afterPhotoUrls: [...existing, ...uploaded] })
    .where(eq(defect.id, id))

  revalidatePath("/defects")
}
