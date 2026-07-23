"use server"

import { db } from "@/lib/db"
import {
  organization,
  membership,
  project,
  inspection,
  ncr,
  defect,
} from "@/lib/db/schema"
import { getUserId } from "@/lib/session"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export async function createOrganization(formData: FormData) {
  const userId = await getUserId()
  const orgName = String(formData.get("orgName") ?? "").trim()
  const projectName = String(formData.get("projectName") ?? "").trim()

  if (!orgName) throw new Error("Organization name is required")

  // Guard: don't create a second org if one already exists.
  const existing = await db
    .select({ id: membership.id })
    .from(membership)
    .where(eq(membership.userId, userId))
    .limit(1)
  if (existing[0]) redirect("/")

  const [org] = await db
    .insert(organization)
    .values({ name: orgName, ownerUserId: userId })
    .returning({ id: organization.id })

  await db.insert(membership).values({
    userId,
    orgId: org.id,
    role: "admin",
  })

  // Seed a starter project so the workspace isn't empty.
  const seedProjectName = projectName || "Sample Project"
  const [proj] = await db
    .insert(project)
    .values({
      orgId: org.id,
      userId,
      name: seedProjectName,
      code: "PRJ-001",
      client: "Demo Client",
      location: "Site A",
      status: "active",
      description: "Auto-generated starter project. Edit or delete anytime.",
    })
    .returning({ id: project.id })

  await db.insert(inspection).values([
    {
      orgId: org.id,
      projectId: proj.id,
      userId,
      title: "Rebar inspection — Level 2 slab",
      type: "quality",
      location: "Block B, Level 2",
      discipline: "Structural",
      status: "in_review",
      priority: "high",
    },
    {
      orgId: org.id,
      projectId: proj.id,
      userId,
      title: "MEP conduit routing check",
      type: "quality",
      location: "Block A, Level 1",
      discipline: "MEP",
      status: "draft",
      priority: "medium",
    },
  ])

  await db.insert(ncr).values({
    orgId: org.id,
    projectId: proj.id,
    userId,
    number: "NCR-001",
    title: "Concrete honeycombing at column C-4",
    description: "Surface voids observed after formwork removal.",
    severity: "major",
    status: "open",
  })

  await db.insert(defect).values({
    orgId: org.id,
    projectId: proj.id,
    userId,
    title: "Cracked floor tile in lobby",
    location: "Ground floor lobby",
    trade: "Finishes",
    status: "open",
    priority: "low",
  })

  redirect("/")
}
