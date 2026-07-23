"use server"

import { db } from "@/lib/db"
import { dailyReport } from "@/lib/db/schema"
import { requireContext } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createDailyReport(formData: FormData) {
  const { orgId, user } = await requireContext()
  const projectId = Number(formData.get("projectId"))
  const reportDate = String(formData.get("reportDate") ?? "").trim()
  if (!projectId) throw new Error("Project is required")
  if (!reportDate) throw new Error("Report date is required")

  const manpowerRaw = String(formData.get("manpower") ?? "").trim()

  await db.insert(dailyReport).values({
    orgId,
    userId: user.id,
    projectId,
    reportDate,
    weather: String(formData.get("weather") ?? "").trim() || null,
    manpower: manpowerRaw ? Number(manpowerRaw) : null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    workDone: String(formData.get("workDone") ?? "").trim() || null,
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
