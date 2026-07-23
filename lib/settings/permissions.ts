import { normalizeRole, type OrgRole } from "@/lib/roles"
import type {
  SettingAction,
  SettingModule,
  OrgSettings,
} from "@/lib/settings/types"
import { DEFAULT_PERMISSIONS } from "@/lib/settings/defaults"

/** Map app routes / nav titles to settings modules. */
export const NAV_MODULE_MAP: Record<string, SettingModule | null> = {
  Dashboard: null,
  Project: "projects",
  "Create Stages": "stages",
  Users: "users",
  Inspections: "inspections",
  NCRs: "ncrs",
  "Defects & Snags": "defects",
  "Daily Reports": "daily_reports",
  Settings: "settings",
  "Import / Export": "import_export",
}

export function can(
  role: string,
  module: SettingModule,
  action: SettingAction,
  permissions?: OrgSettings["permissions"],
): boolean {
  const key = normalizeRole(role)
  const matrix = permissions ?? DEFAULT_PERMISSIONS
  const allowed = matrix[key]?.[module] ?? []
  return allowed.includes(action)
}

export function assertCan(
  role: string,
  module: SettingModule,
  action: SettingAction,
  permissions?: OrgSettings["permissions"],
) {
  if (!can(role, module, action, permissions)) {
    throw new Error(`Forbidden: ${normalizeRole(role)} cannot ${action} ${module}`)
  }
}

export function modulesForRole(
  role: string,
  permissions?: OrgSettings["permissions"],
): SettingModule[] {
  const key = normalizeRole(role) as OrgRole
  const matrix = permissions ?? DEFAULT_PERMISSIONS
  return (Object.keys(matrix[key] ?? {}) as SettingModule[]).filter((m) =>
    (matrix[key][m] ?? []).includes("view"),
  )
}
