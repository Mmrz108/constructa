"use server"

import { db } from "@/lib/db"
import {
  organization,
  membership,
  project,
  inspection,
  ncr,
  defect,
  progressSnapshot,
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
      client: "Al Noor Holdings",
      location: "Dubai, UAE",
      status: "active",
      contractor: "Atlas Contracting",
      consultant: "BuildSight Consulting",
      ownerUserId: userId,
      contractorUserId: userId,
      supervisorUserId: userId,
      handoverDate: "2026-12-18",
      progressPlanned: 72,
      progressActual: 68,
      imageUrl: "/images/project-hero.png",
      description: "Auto-generated starter project. Edit or delete anytime.",
    })
    .returning({ id: project.id })

  const progressWeeks: [string, number, number][] = [
    ["Mar 17", 22, 20],
    ["Mar 24", 30, 26],
    ["Mar 31", 38, 33],
    ["Apr 7", 46, 41],
    ["Apr 14", 53, 48],
    ["Apr 21", 60, 54],
    ["Apr 28", 66, 60],
    ["May 5", 69, 64],
    ["May 12", 72, 68],
  ]
  await db.insert(progressSnapshot).values(
    progressWeeks.map(([label, planned, actual], idx) => ({
      orgId: org.id,
      projectId: proj.id,
      userId,
      label,
      planned,
      actual,
      sortOrder: idx,
    })),
  )

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
