"use server"

import { db } from "@/lib/db"
import { membership, user } from "@/lib/db/schema"
import { requireContext, requireUser } from "@/lib/session"
import { saveUploadedImage } from "@/lib/uploads"
import { createDefaultAvatarFile } from "@/lib/avatar"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

function revalidateProfile() {
  revalidatePath("/")
  revalidatePath("/users")
  revalidatePath("/settings")
}

async function setUserImage(userId: string, image: string | null) {
  await db
    .update(user)
    .set({ image, updatedAt: new Date() })
    .where(eq(user.id, userId))
}

export async function updateMyAvatar(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const me = await requireUser()
    const file = formData.get("avatar")
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Please choose a photo." }
    }

    const url = await saveUploadedImage(file, "avatars", me.id)
    await setUserImage(me.id, url)
    revalidateProfile()
    return { ok: true, url }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update photo",
    }
  }
}

/** Remove photo and restore a generated initials avatar. */
export async function removeMyAvatar(): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  try {
    const me = await requireUser()
    const url = await createDefaultAvatarFile(me.id, me.name)
    await setUserImage(me.id, url)
    revalidateProfile()
    return { ok: true, url }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not remove photo",
    }
  }
}

/** Admin: set another org member's photo. */
export async function updateMemberAvatar(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const ctx = await requireContext()
    const { getOrgSettings, assertCan } = await import("@/lib/settings")
    assertCan(
      ctx.role,
      "users",
      "edit",
      (await getOrgSettings(ctx.orgId)).permissions,
    )

    const userId = String(formData.get("userId") ?? "").trim()
    const file = formData.get("avatar")
    if (!userId) return { ok: false, error: "User is required." }
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Please choose a photo." }
    }

    const member = await db
      .select({ id: membership.id })
      .from(membership)
      .where(
        and(eq(membership.orgId, ctx.orgId), eq(membership.userId, userId)),
      )
      .limit(1)
    if (!member[0]) return { ok: false, error: "User is not in this organization." }

    const url = await saveUploadedImage(file, "avatars", userId)
    await setUserImage(userId, url)
    revalidateProfile()
    return { ok: true, url }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update photo",
    }
  }
}

/** Admin: reset member photo to initials avatar. */
export async function removeMemberAvatar(
  userId: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const ctx = await requireContext()
    const { getOrgSettings, assertCan } = await import("@/lib/settings")
    assertCan(
      ctx.role,
      "users",
      "edit",
      (await getOrgSettings(ctx.orgId)).permissions,
    )

    const rows = await db
      .select({ name: user.name })
      .from(membership)
      .innerJoin(user, eq(user.id, membership.userId))
      .where(
        and(eq(membership.orgId, ctx.orgId), eq(membership.userId, userId)),
      )
      .limit(1)
    if (!rows[0]) return { ok: false, error: "User is not in this organization." }

    const url = await createDefaultAvatarFile(userId, rows[0].name)
    await setUserImage(userId, url)
    revalidateProfile()
    return { ok: true, url }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not remove photo",
    }
  }
}
