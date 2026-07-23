import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { membership, project, projectMembership } from "@/lib/db/schema"
import { ORG_ROLES, type OrgRole } from "@/lib/roles"
import { and, eq } from "drizzle-orm"

const PASSWORD = "Test1234!"
const ORG_ID = 1

const USERS: { role: OrgRole; name: string; email: string }[] = [
  {
    role: "admin",
    name: "Admin User",
    email: "admin@bonyan.test",
  },
  {
    role: "client",
    name: "Client Employer",
    email: "client@bonyan.test",
  },
  {
    role: "contractor",
    name: "Contractor User",
    email: "contractor@bonyan.test",
  },
  {
    role: "supervisor",
    name: "Supervisor User",
    email: "supervisor@bonyan.test",
  },
  {
    role: "developer",
    name: "Developer User",
    email: "developer@bonyan.test",
  },
  {
    role: "consultant",
    name: "Consultant User",
    email: "consultant@bonyan.test",
  },
  {
    role: "project_manager",
    name: "Project Manager",
    email: "pm@bonyan.test",
  },
]

async function ensureUser(name: string, email: string) {
  const { user: userTable } = await import("@/lib/db/schema")
  const existing = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)
  if (existing[0]) return existing[0].id

  const created = await auth.api.signUpEmail({
    body: { name, email, password: PASSWORD },
  })
  return created.user.id
}

async function ensureMembership(userId: string, role: OrgRole) {
  const rows = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, ORG_ID)))
    .limit(1)
  if (rows[0]) {
    await db
      .update(membership)
      .set({ role })
      .where(eq(membership.id, rows[0].id))
  } else {
    await db.insert(membership).values({ userId, orgId: ORG_ID, role })
  }
}

async function assignToAllProjects(userId: string, role: OrgRole) {
  const projects = await db
    .select({ id: project.id })
    .from(project)
    .where(eq(project.orgId, ORG_ID))

  for (const p of projects) {
    const existing = await db
      .select({ id: projectMembership.id })
      .from(projectMembership)
      .where(
        and(
          eq(projectMembership.orgId, ORG_ID),
          eq(projectMembership.projectId, p.id),
          eq(projectMembership.userId, userId),
          eq(projectMembership.role, role),
        ),
      )
      .limit(1)
    if (!existing[0]) {
      await db.insert(projectMembership).values({
        orgId: ORG_ID,
        projectId: p.id,
        userId,
        role,
      })
    }
  }
}

async function main() {
  console.log("Seeding role test users…")
  console.log(`Password for all: ${PASSWORD}\n`)

  for (const u of USERS) {
    if (!ORG_ROLES.includes(u.role)) continue
    const id = await ensureUser(u.name, u.email)
    await ensureMembership(id, u.role)
    await assignToAllProjects(id, u.role)
    console.log(`✓ ${u.role.padEnd(16)} ${u.email}`)
  }

  console.log("\nDone.")
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
