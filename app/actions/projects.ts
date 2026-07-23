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

  await db.insert(project).values({
    orgId,
    userId: user.id,
    name,
    code: String(formData.get("code") ?? "").trim() || null,
    client: String(formData.get("client") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active"),
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
