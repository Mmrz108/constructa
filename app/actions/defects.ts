"use server"

import { db } from "@/lib/db"
import { defect } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Defect / snag lifecycle transitions. */
const transitions: Record<string, string[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["fixed", "open"],
  fixed: ["verified", "in_progress"],
  verified: ["closed", "in_progress"],
  closed: [],
}

export async function createDefect(formData: FormData) {
  const { orgId, user } = await requireContext()
  const title = String(formData.get("title") ?? "").trim()
  const projectId = Number(formData.get("projectId"))
  if (!title) throw new Error("Title is required")
  if (!projectId) throw new Error("Project is required")

  await db.insert(defect).values({
    orgId,
    userId: user.id,
    projectId,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    trade: String(formData.get("trade") ?? "").trim() || null,
    priority: String(formData.get("priority") ?? "medium"),
    assignedTo: String(formData.get("assignedTo") ?? "").trim() || null,
    status: "open",
  })

  revalidatePath("/defects")
  revalidatePath("/")
}

export async function transitionDefect(id: number, to: string) {
  const { orgId } = await requireContext()
  const rows = await db
    .select({ status: defect.status })
    .from(defect)
    .where(and(eq(defect.id, id), eq(defect.orgId, orgId)))
    .limit(1)
  const current = rows[0]
  if (!current) throw new Error("Defect not found")

  const allowed = transitions[current.status] ?? []
  if (!allowed.includes(to)) {
    throw new Error(`Cannot move from "${current.status}" to "${to}".`)
  }

  await db
    .update(defect)
    .set({ status: to })
    .where(and(eq(defect.id, id), eq(defect.orgId, orgId)))

  revalidatePath("/defects")
  revalidatePath("/")
}
