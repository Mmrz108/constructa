import "server-only"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { membership, organization } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export type SessionUser = {
  id: string
  name: string
  email: string
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")
  return user
}

export async function getUserId(): Promise<string> {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

export type ActiveContext = {
  user: SessionUser
  orgId: number
  orgName: string
  role: string
}

/**
 * Resolves the signed-in user's active organization + role.
 * Redirects to onboarding if the user has no organization yet.
 */
export async function requireContext(): Promise<ActiveContext> {
  const user = await requireUser()

  const rows = await db
    .select({
      orgId: membership.orgId,
      role: membership.role,
      orgName: organization.name,
    })
    .from(membership)
    .innerJoin(organization, eq(organization.id, membership.orgId))
    .where(eq(membership.userId, user.id))
    .limit(1)

  const ctx = rows[0]
  if (!ctx) redirect("/onboarding")

  return {
    user,
    orgId: ctx.orgId,
    orgName: ctx.orgName,
    role: ctx.role,
  }
}

/** Verify the user belongs to a given org (defense in depth for mutations). */
export async function assertMembership(userId: string, orgId: number) {
  const rows = await db
    .select({ id: membership.id })
    .from(membership)
    .where(and(eq(membership.userId, userId), eq(membership.orgId, orgId)))
    .limit(1)
  if (!rows[0]) throw new Error("Forbidden: not a member of this organization")
}
