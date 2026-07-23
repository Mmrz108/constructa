"use server"

import { db } from "@/lib/db"
import { checklistTemplate } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

function parseItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function createChecklistTemplate(formData: FormData) {
  const { orgId, user } = await requireContext()
  const name = String(formData.get("name") ?? "").trim()
  if (!name) throw new Error("Template name is required")

  const items = parseItems(String(formData.get("items") ?? ""))
  if (items.length === 0) throw new Error("Add at least one checklist item")

  await db.insert(checklistTemplate).values({
    orgId,
    userId: user.id,
    name,
    discipline: String(formData.get("discipline") ?? "").trim() || null,
    version: 1,
    isActive: true,
    items,
  })

  revalidatePath("/checklists")
}

/**
 * Publish a new version of an existing template: deactivates all prior
 * versions with the same name and inserts a fresh active version.
 */
export async function reviseChecklistTemplate(formData: FormData) {
  const { orgId, user } = await requireContext()
  const name = String(formData.get("name") ?? "").trim()
  const nextVersion = Number(formData.get("nextVersion"))
  if (!name || !nextVersion) throw new Error("Invalid revision request")

  const items = parseItems(String(formData.get("items") ?? ""))
  if (items.length === 0) throw new Error("Add at least one checklist item")

  await db
    .update(checklistTemplate)
    .set({ isActive: false })
    .where(
      and(
        eq(checklistTemplate.orgId, orgId),
        eq(checklistTemplate.name, name),
      ),
    )

  await db.insert(checklistTemplate).values({
    orgId,
    userId: user.id,
    name,
    discipline: String(formData.get("discipline") ?? "").trim() || null,
    version: nextVersion,
    isActive: true,
    items,
  })

  revalidatePath("/checklists")
}
