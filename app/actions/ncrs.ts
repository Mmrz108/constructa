"use server"

import { db } from "@/lib/db"
import { ncr } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, count, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Valid NCR status transitions. */
const transitions: Record<string, string[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "open"],
  resolved: ["closed", "in_progress"],
  closed: [],
}

export async function createNcr(formData: FormData) {
  const { orgId, user } = await requireContext()
  const title = String(formData.get("title") ?? "").trim()
  const projectId = Number(formData.get("projectId"))
  if (!title) throw new Error("Title is required")
  if (!projectId) throw new Error("Project is required")

  // Auto-number NCRs per org: NCR-001, NCR-002, ...
  const [{ c }] = await db
    .select({ c: count() })
    .from(ncr)
    .where(eq(ncr.orgId, orgId))
  const number = `NCR-${String(c + 1).padStart(3, "0")}`

  const dueRaw = String(formData.get("dueDate") ?? "").trim()

  await db.insert(ncr).values({
    orgId,
    userId: user.id,
    projectId,
    number,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    severity: String(formData.get("severity") ?? "minor"),
    status: "open",
    assignedTo: String(formData.get("assignedTo") ?? "").trim() || null,
    dueDate: dueRaw || null,
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
