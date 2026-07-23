"use server"

import { db } from "@/lib/db"
import { checklistTemplate } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import {
  normalizeStageQuestions,
  type StageQuestion,
} from "@/lib/stage-form"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

function parseQuestionsJson(raw: string): StageQuestion[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("Invalid questions payload")
  }
  const questions = normalizeStageQuestions(parsed)
  if (questions.length === 0) {
    throw new Error("Add at least one question")
  }
  for (const q of questions) {
    if (
      (q.type === "single_choice" || q.type === "multi_choice") &&
      (!q.options || q.options.length < 2)
    ) {
      throw new Error(`"${q.label}" needs at least 2 options`)
    }
  }
  return questions
}

function parseFormPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  if (!name) throw new Error("Stage name is required")

  const projectId = Number(formData.get("projectId"))
  if (!projectId) throw new Error("A project is required")

  const supervisorUserId =
    String(formData.get("supervisorUserId") ?? "").trim() || null

  const questionsRaw = String(formData.get("questions") ?? "").trim()
  let items: StageQuestion[]

  if (questionsRaw) {
    items = parseQuestionsJson(questionsRaw)
  } else {
    const lines = String(formData.get("items") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    if (lines.length === 0) throw new Error("Add at least one question")
    items = normalizeStageQuestions(lines)
  }

  return {
    name,
    projectId,
    supervisorUserId,
    discipline: String(formData.get("discipline") ?? "").trim() || null,
    items,
  }
}

function revalidateStages() {
  revalidatePath("/checklists")
  revalidatePath("/stages")
  revalidatePath("/inspections")
}

export async function createChecklistTemplate(formData: FormData) {
  const { orgId, user } = await requireContext()
  const payload = parseFormPayload(formData)

  await db.insert(checklistTemplate).values({
    orgId,
    userId: user.id,
    projectId: payload.projectId,
    supervisorUserId: payload.supervisorUserId,
    name: payload.name,
    discipline: payload.discipline,
    version: 1,
    isActive: true,
    items: payload.items,
  })

  revalidateStages()
}

export async function updateChecklistTemplate(
  id: number,
  formData: FormData,
) {
  const { orgId } = await requireContext()
  const payload = parseFormPayload(formData)

  const [existing] = await db
    .select({ id: checklistTemplate.id, version: checklistTemplate.version })
    .from(checklistTemplate)
    .where(
      and(eq(checklistTemplate.id, id), eq(checklistTemplate.orgId, orgId)),
    )
    .limit(1)

  if (!existing) throw new Error("Stage form not found")

  await db
    .update(checklistTemplate)
    .set({
      projectId: payload.projectId,
      supervisorUserId: payload.supervisorUserId,
      name: payload.name,
      discipline: payload.discipline,
      items: payload.items,
      version: (existing.version ?? 1) + 1,
      isActive: true,
    })
    .where(
      and(eq(checklistTemplate.id, id), eq(checklistTemplate.orgId, orgId)),
    )

  revalidateStages()
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

  const payload = parseFormPayload(formData)

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
    projectId: payload.projectId,
    supervisorUserId: payload.supervisorUserId,
    name: payload.name,
    discipline: payload.discipline,
    version: nextVersion,
    isActive: true,
    items: payload.items,
  })

  revalidateStages()
}
