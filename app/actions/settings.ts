"use server"

import { revalidatePath } from "next/cache"
import { requireContext, assertAdminRole } from "@/lib/session"
import { normalizeRole } from "@/lib/roles"
import {
  getOrgSettings,
  getOrgSettingsPublic,
  patchOrgSettingsSection,
  listAuditLogs,
  writeAuditLog,
  type OrgSettings,
} from "@/lib/settings"
import { saveUploadedImage } from "@/lib/uploads"

export async function loadSettingsForUi() {
  const ctx = await requireContext()
  const settings = await getOrgSettingsPublic(ctx.orgId)
  return { settings, role: ctx.role, isAdmin: normalizeRole(ctx.role) === "admin" }
}

export async function loadAuditLogsAction(limit = 50) {
  const ctx = await requireContext()
  assertAdminRole(ctx.role)
  return listAuditLogs(ctx.orgId, limit)
}

type SaveResult = { ok: true; settings: OrgSettings } | { ok: false; error: string }

export async function saveSettingsSection(
  section: keyof OrgSettings,
  payload: unknown,
): Promise<SaveResult> {
  try {
    const ctx = await requireContext()
    assertAdminRole(ctx.role)

    const settings = await patchOrgSettingsSection(
      ctx.orgId,
      section,
      payload as OrgSettings[typeof section],
      ctx.user.id,
    )

    await writeAuditLog({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      action: "settings.update",
      module: "settings",
      entityType: section,
      summary: `Updated settings section: ${section}`,
    })

    revalidatePath("/settings")
    revalidatePath("/")
    revalidatePath("/import-export")
    return { ok: true, settings: await getOrgSettingsPublic(ctx.orgId) }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save settings",
    }
  }
}

export async function uploadSettingsAsset(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const ctx = await requireContext()
    assertAdminRole(ctx.role)
    const file = formData.get("file")
    if (!(file instanceof File)) return { ok: false, error: "No file" }
    const kind = String(formData.get("kind") ?? "logo")
    const url = await saveUploadedImage(file, `settings/${ctx.orgId}`, kind)
    await writeAuditLog({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      action: "settings.upload",
      module: "settings",
      summary: `Uploaded ${kind}`,
      meta: { url },
    })
    return { ok: true, url }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Upload failed",
    }
  }
}

/** Used by other modules — returns live (unmasked) settings server-side. */
export async function getSettingsForOrg() {
  const ctx = await requireContext()
  return getOrgSettings(ctx.orgId)
}
