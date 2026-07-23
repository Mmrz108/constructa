"use server"

import { db } from "@/lib/db"
import { project } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const { orgId, user } = await requireContext()
  const name = String(formData.get("name") ?? "").trim()
  if (!name) throw new Error("Project name is required")

  const ownerUserId = String(formData.get("ownerUserId") ?? "").trim() || null
  const contractorUserId =
    String(formData.get("contractorUserId") ?? "").trim() || null
  const supervisorUserId =
    String(formData.get("supervisorUserId") ?? "").trim() || null
  const developerRaw = String(formData.get("developerUserId") ?? "").trim()
  const developerUserId =
    developerRaw && developerRaw !== "none" ? developerRaw : null

  if (!ownerUserId) throw new Error("An owner must be assigned")
  if (!contractorUserId) throw new Error("A contractor must be assigned")
  if (!supervisorUserId) throw new Error("A supervisor must be assigned")

  await db.insert(project).values({
    orgId,
    userId: user.id,
    name,
    code: String(formData.get("code") ?? "").trim() || null,
    client: String(formData.get("client") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active"),
    ownerUserId,
    contractorUserId,
    supervisorUserId,
    developerUserId,
  })

  revalidatePath("/projects")
  revalidatePath("/")
}

export async function updateProjectStatus(id: number, status: string) {
  const { orgId } = await requireContext()
  await db
    .update(project)
    .set({ status })
    .where(and(eq(project.id, id), eq(project.orgId, orgId)))
  revalidatePath("/projects")
}
