import "server-only"
import { db } from "@/lib/db"
import { orgSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { mergeSettings } from "@/lib/settings/defaults"
import type { OrgSettings } from "@/lib/settings/types"

export async function getOrgSettings(orgId: number): Promise<OrgSettings> {
  const rows = await db
    .select()
    .from(orgSettings)
    .where(eq(orgSettings.orgId, orgId))
    .limit(1)
  return mergeSettings((rows[0]?.data as Partial<OrgSettings> | null) ?? null)
}

/** Public-safe settings (API key masked). */
export async function getOrgSettingsPublic(orgId: number): Promise<OrgSettings> {
  const settings = await getOrgSettings(orgId)
  if (settings.ai.openaiApiKey) {
    const key = settings.ai.openaiApiKey
    settings.ai.openaiApiKey =
      key.length > 8 ? `${key.slice(0, 3)}••••${key.slice(-4)}` : "••••••••"
  }
  return settings
}

export async function saveOrgSettings(
  orgId: number,
  data: OrgSettings,
  updatedBy: string,
): Promise<OrgSettings> {
  const merged = mergeSettings(data)
  const existing = await db
    .select({ orgId: orgSettings.orgId })
    .from(orgSettings)
    .where(eq(orgSettings.orgId, orgId))
    .limit(1)

  if (existing[0]) {
    await db
      .update(orgSettings)
      .set({ data: merged, updatedAt: new Date(), updatedBy })
      .where(eq(orgSettings.orgId, orgId))
  } else {
    await db.insert(orgSettings).values({
      orgId,
      data: merged,
      updatedBy,
    })
  }
  return merged
}

export async function patchOrgSettingsSection<K extends keyof OrgSettings>(
  orgId: number,
  section: K,
  value: OrgSettings[K],
  updatedBy: string,
): Promise<OrgSettings> {
  const current = await getOrgSettings(orgId)

  // Preserve real API key when client sends masked value
  if (section === "ai") {
    const ai = value as OrgSettings["ai"]
    if (ai.openaiApiKey.includes("•") || ai.openaiApiKey.includes("*")) {
      ai.openaiApiKey = current.ai.openaiApiKey
    }
  }

  const next = { ...current, [section]: value }
  return saveOrgSettings(orgId, next, updatedBy)
}
