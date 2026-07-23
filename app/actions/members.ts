"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { membership, user } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const ORG_ROLES = [
  "supervisor",
  "owner",
  "contractor",
  "developer",
  "inspector",
  "manager",
] as const

type AddMemberResult = { ok: true } | { ok: false; error: string }

export async function addMember(formData: FormData): Promise<AddMemberResult> {
  const { orgId } = await requireContext()

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const role = String(formData.get("role") ?? "supervisor").trim()

  if (!name || !email || !password) {
    return { ok: false, error: "Name, email and password are required." }
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." }
  }
  if (!ORG_ROLES.includes(role as (typeof ORG_ROLES)[number])) {
    return { ok: false, error: "Invalid role." }
  }

  // Reuse an existing account if the email already exists, otherwise create one.
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
      return { ok: false, error: "Could not create this account. The email may already be in use." }
    }
  }

  // Avoid duplicate membership rows.
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

  revalidatePath("/team")
  revalidatePath("/projects")
  return { ok: true }
}
