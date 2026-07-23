"use server"

import { auth } from "@/lib/auth"
import { hashPassword } from "better-auth/crypto"
import { db } from "@/lib/db"
import { account, membership, projectMembership, user } from "@/lib/db/schema"
import { isOrgRole, normalizeRole } from "@/lib/roles"
import { requireContext } from "@/lib/session"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type ActionResult = { ok: true } | { ok: false; error: string }

function revalidateUsers() {
  revalidatePath("/users")
  revalidatePath("/user-access")
  revalidatePath("/team")
  revalidatePath("/projects")
}

async function assertUsersPermission(
  orgId: number,
  actorRole: string,
  action: "create" | "edit" | "delete" | "view",
): Promise<ActionResult | null> {
  try {
    const { getOrgSettings, assertCan } = await import("@/lib/settings")
    assertCan(
      actorRole,
      "users",
      action,
      (await getOrgSettings(orgId)).permissions,
    )
    return null
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Forbidden",
    }
  }
}

async function audit(
  orgId: number,
  userId: string,
  action: string,
  summary: string,
  entityId?: string,
) {
  try {
    const { writeAuditLog } = await import("@/lib/settings/audit")
    await writeAuditLog({
      orgId,
      userId,
      action,
      module: "users",
      entityType: "user",
      entityId,
      summary,
    })
  } catch {
    // audit failures must not block membership ops
  }
}

export async function addMember(formData: FormData): Promise<ActionResult> {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const denied = await assertUsersPermission(orgId, actorRole, "create")
  if (denied) return denied

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const roleRaw = String(formData.get("role") ?? "supervisor").trim()
  const role = normalizeRole(roleRaw)

  if (!name || !email || !password) {
    return { ok: false, error: "Name, email and password are required." }
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." }
  }
  if (!isOrgRole(role)) {
    return { ok: false, error: "Invalid role." }
  }

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  let memberId: string

  if (existing[0]) {
    memberId = existing[0].id
  } else {
    try {
      const created = await auth.api.signUpEmail({
        body: { name, email, password },
      })
      memberId = created.user.id
    } catch {
      return {
        ok: false,
        error:
          "Could not create this account. The email may already be in use.",
      }
    }
  }

  // Profile photo (optional) — otherwise generate initials avatar
  const avatarFile = formData.get("avatar")
  try {
    if (avatarFile instanceof File && avatarFile.size > 0) {
      const { saveUploadedImage } = await import("@/lib/uploads")
      const url = await saveUploadedImage(avatarFile, "avatars", memberId)
      await db
        .update(user)
        .set({ image: url, updatedAt: new Date() })
        .where(eq(user.id, memberId))
    } else {
      const { ensureUserAvatar } = await import("@/lib/avatar")
      const current = await db
        .select({ image: user.image })
        .from(user)
        .where(eq(user.id, memberId))
        .limit(1)
      await ensureUserAvatar({
        id: memberId,
        name,
        image: current[0]?.image ?? null,
      })
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save profile photo",
    }
  }

  const already = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, memberId), eq(membership.orgId, orgId)))
    .limit(1)

  if (already[0]) {
    await db
      .update(membership)
      .set({ role })
      .where(eq(membership.id, already[0].id))
  } else {
    await db.insert(membership).values({ userId: memberId, orgId, role })
  }

  // Optional multi-project assignment at create time (comma-separated ids)
  const projectIdsRaw = String(formData.get("projectIds") ?? "").trim()
  if (projectIdsRaw) {
    const projectIds = projectIdsRaw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)
    for (const projectId of projectIds) {
      await assignUserToProject(memberId, projectId, role)
    }
  }

  await audit(orgId, actor.id, "create", `Added user ${name} (${email}) as ${role}`, memberId)
  revalidateUsers()
  revalidatePath("/")
  return { ok: true }
}

export async function updateMember(
  userId: string,
  formData: FormData,
): Promise<ActionResult> {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const denied = await assertUsersPermission(orgId, actorRole, "edit")
  if (denied) return denied

  const member = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))
    .limit(1)
  if (!member[0]) return { ok: false, error: "User is not in this organization." }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const roleRaw = String(formData.get("role") ?? "").trim()
  const role = normalizeRole(roleRaw)
  const password = String(formData.get("password") ?? "")

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." }
  }
  if (!isOrgRole(role)) {
    return { ok: false, error: "Invalid role." }
  }
  if (password && password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." }
  }

  const emailTaken = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.email, email), ne(user.id, userId)))
    .limit(1)
  if (emailTaken[0]) {
    return { ok: false, error: "Another account already uses this email." }
  }

  await db
    .update(user)
    .set({ name, email, updatedAt: new Date() })
    .where(eq(user.id, userId))

  await db
    .update(membership)
    .set({ role })
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))

  // Keep project membership roles in sync with org role
  await db
    .update(projectMembership)
    .set({ role })
    .where(
      and(
        eq(projectMembership.userId, userId),
        eq(projectMembership.orgId, orgId),
      ),
    )

  if (password) {
    const hashed = await hashPassword(password)
    const cred = await db
      .select({ id: account.id })
      .from(account)
      .where(
        and(eq(account.userId, userId), eq(account.providerId, "credential")),
      )
      .limit(1)
    if (cred[0]) {
      await db
        .update(account)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(account.id, cred[0].id))
    } else {
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: hashed,
      })
    }
  }

  await audit(
    orgId,
    actor.id,
    "edit",
    `Updated user ${name} (${email}) → role ${role}`,
    userId,
  )
  revalidateUsers()
  revalidatePath("/")
  return { ok: true }
}

/** Remove a user from this organization (and delete the account if unused elsewhere). */
export async function removeMember(userId: string): Promise<ActionResult> {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const denied = await assertUsersPermission(orgId, actorRole, "delete")
  if (denied) return denied

  if (userId === actor.id) {
    return { ok: false, error: "You cannot remove your own account." }
  }

  const member = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))
    .limit(1)
  if (!member[0]) return { ok: false, error: "User is not in this organization." }

  const target = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  await db
    .delete(projectMembership)
    .where(
      and(
        eq(projectMembership.orgId, orgId),
        eq(projectMembership.userId, userId),
      ),
    )
  await db
    .delete(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))

  const otherOrgs = await db
    .select({ id: membership.id })
    .from(membership)
    .where(eq(membership.userId, userId))
    .limit(1)

  let deletedAccount = false
  if (!otherOrgs[0]) {
    await db.delete(user).where(eq(user.id, userId))
    deletedAccount = true
  }

  await audit(
    orgId,
    actor.id,
    "delete",
    deletedAccount
      ? `Deleted user ${target[0]?.name ?? userId} (${target[0]?.email ?? ""})`
      : `Removed ${target[0]?.name ?? userId} from organization`,
    userId,
  )
  revalidateUsers()
  revalidatePath("/")
  return { ok: true }
}

export async function updateMemberRole(userId: string, roleRaw: string) {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const denied = await assertUsersPermission(orgId, actorRole, "edit")
  if (denied && !denied.ok) throw new Error(denied.error)

  const role = normalizeRole(roleRaw)
  if (!isOrgRole(role)) throw new Error("Invalid role")

  await db
    .update(membership)
    .set({ role })
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))

  await audit(orgId, actor.id, "edit", `Changed role for ${userId} → ${role}`, userId)
  revalidateUsers()
}

export async function assignUserToProject(
  userId: string,
  projectId: number,
  roleRaw: string,
) {
  const { orgId } = await requireContext()
  const role = normalizeRole(roleRaw)
  if (!isOrgRole(role)) throw new Error("Invalid role")
  if (!projectId) throw new Error("Project is required")

  const existing = await db
    .select({ id: projectMembership.id })
    .from(projectMembership)
    .where(
      and(
        eq(projectMembership.orgId, orgId),
        eq(projectMembership.projectId, projectId),
        eq(projectMembership.userId, userId),
        eq(projectMembership.role, role),
      ),
    )
    .limit(1)

  if (!existing[0]) {
    await db.insert(projectMembership).values({
      orgId,
      projectId,
      userId,
      role,
    })
  }

  revalidateUsers()
}

export async function removeUserFromProject(
  userId: string,
  projectId: number,
  roleRaw?: string,
) {
  const { orgId } = await requireContext()
  const filters = [
    eq(projectMembership.orgId, orgId),
    eq(projectMembership.projectId, projectId),
    eq(projectMembership.userId, userId),
  ]
  if (roleRaw) {
    filters.push(eq(projectMembership.role, normalizeRole(roleRaw)))
  }

  await db.delete(projectMembership).where(and(...filters))
  revalidateUsers()
}

export async function setUserProjectAssignments(
  userId: string,
  formData: FormData,
) {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const denied = await assertUsersPermission(orgId, actorRole, "edit")
  if (denied && !denied.ok) throw new Error(denied.error)

  const role = normalizeRole(String(formData.get("role") ?? "supervisor"))
  if (!isOrgRole(role)) throw new Error("Invalid role")

  const projectIds = formData
    .getAll("projectId")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0)

  await db
    .delete(projectMembership)
    .where(
      and(
        eq(projectMembership.orgId, orgId),
        eq(projectMembership.userId, userId),
      ),
    )

  for (const projectId of projectIds) {
    await db.insert(projectMembership).values({
      orgId,
      projectId,
      userId,
      role,
    })
  }

  // Keep org membership role in sync
  await db
    .update(membership)
    .set({ role })
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))

  await audit(
    orgId,
    actor.id,
    "edit",
    `Updated project access for ${userId} (${projectIds.length} projects, role ${role})`,
    userId,
  )
  revalidateUsers()
}
