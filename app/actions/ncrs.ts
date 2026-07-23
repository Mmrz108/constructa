"use server"

import { db } from "@/lib/db"
import { ncr } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { saveUploadedFiles } from "@/lib/uploads"
import { and, count, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Valid NCR status transitions — trackable until closed. */
const transitions: Record<string, string[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "open"],
  resolved: ["closed", "in_progress"],
  closed: [],
}

export async function createNcr(formData: FormData) {
  const { orgId, user, role } = await requireContext()
  const { getOrgSettings, assertCan } = await import("@/lib/settings")
  const settings = await getOrgSettings(orgId)
  assertCan(role, "ncrs", "create", settings.permissions)

  const title = String(formData.get("title") ?? "").trim()
  const projectId = Number(formData.get("projectId"))
  if (!title) throw new Error("Title is required")
  if (!projectId) throw new Error("Project is required")

  const [{ c }] = await db
    .select({ c: count() })
    .from(ncr)
    .where(eq(ncr.orgId, orgId))
  const number = `NCR-${String(c + 1).padStart(3, "0")}`

  const dueRaw = String(formData.get("dueDate") ?? "").trim()
  const stageRaw = String(formData.get("stageId") ?? "").trim()
  const stageId = stageRaw ? Number(stageRaw) : null

  const attachments = await saveUploadedFiles(
    formData,
    "attachments",
    `ncrs/${orgId}`,
  )

  await db.insert(ncr).values({
    orgId,
    userId: user.id,
    projectId,
    stageId: stageId || null,
    number,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    violatedStandard:
      String(formData.get("violatedStandard") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    severity: String(formData.get("severity") ?? "minor"),
    priority: String(formData.get("priority") ?? "medium"),
    status: "open",
    assignedTo: String(formData.get("assignedTo") ?? "").trim() || null,
    dueDate: dueRaw || null,
    attachments,
  })

  revalidatePath("/ncrs")
  revalidatePath("/")
}

export async function transitionNcr(id: number, to: string) {
  const { orgId } = await requireContext()
  const rows = await db
    .select({ status: ncr.status })
    .from(ncr)
    .where(and(eq(ncr.id, id), eq(ncr.orgId, orgId)))
    .limit(1)
  const current = rows[0]
  if (!current) throw new Error("NCR not found")

  const allowed = transitions[current.status] ?? []
  if (!allowed.includes(to)) {
    throw new Error(`Cannot move from "${current.status}" to "${to}".`)
  }

  await db
    .update(ncr)
    .set({ status: to, updatedAt: new Date() })
    .where(and(eq(ncr.id, id), eq(ncr.orgId, orgId)))

  revalidatePath("/ncrs")
  revalidatePath("/")
}
