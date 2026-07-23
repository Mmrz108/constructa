"use server"

import { db } from "@/lib/db"
import { dailyReport } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { saveUploadedFiles } from "@/lib/uploads"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createDailyReport(formData: FormData) {
  const { orgId, user } = await requireContext()
  const projectId = Number(formData.get("projectId"))
  const reportDate = String(formData.get("reportDate") ?? "").trim()
  if (!projectId) throw new Error("Project is required")
  if (!reportDate) throw new Error("Report date is required")

  const manpowerRaw = String(formData.get("manpower") ?? "").trim()
  const stageRaw = String(formData.get("stageId") ?? "").trim()
  const stageId = stageRaw ? Number(stageRaw) : null

  const photoUrls = await saveUploadedFiles(
    formData,
    "photos",
    `daily-reports/${orgId}`,
  )

  const signature = String(formData.get("supervisorSignature") ?? "").trim()

  await db.insert(dailyReport).values({
    orgId,
    userId: user.id,
    projectId,
    stageId: stageId || null,
    reportDate,
    weather: String(formData.get("weather") ?? "").trim() || null,
    manpower: manpowerRaw ? Number(manpowerRaw) : null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    workDone: String(formData.get("workDone") ?? "").trim() || null,
    tomorrowPlan: String(formData.get("tomorrowPlan") ?? "").trim() || null,
    equipment: String(formData.get("equipment") ?? "").trim() || null,
    problemsRisks: String(formData.get("problemsRisks") ?? "").trim() || null,
    incidents: String(formData.get("incidents") ?? "").trim() || null,
    photoUrls,
    supervisorSignature: signature || null,
    signedAt: signature ? new Date() : null,
    status: "draft",
  })

  revalidatePath("/daily-reports")
}

export async function submitDailyReport(id: number) {
  const { orgId } = await requireContext()
  await db
    .update(dailyReport)
    .set({ status: "submitted" })
    .where(and(eq(dailyReport.id, id), eq(dailyReport.orgId, orgId)))
  revalidatePath("/daily-reports")
}

export async function closeDailyReport(id: number) {
  const { orgId } = await requireContext()
  await db
    .update(dailyReport)
    .set({ status: "closed" })
    .where(and(eq(dailyReport.id, id), eq(dailyReport.orgId, orgId)))
  revalidatePath("/daily-reports")
}

export async function signDailyReport(id: number, signature: string) {
  const { orgId } = await requireContext()
  const sig = signature.trim()
  if (!sig) throw new Error("Supervisor signature is required")

  await db
    .update(dailyReport)
    .set({
      supervisorSignature: sig,
      signedAt: new Date(),
      status: "submitted",
    })
    .where(and(eq(dailyReport.id, id), eq(dailyReport.orgId, orgId)))
  revalidatePath("/daily-reports")
}
