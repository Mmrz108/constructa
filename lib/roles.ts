/** Org / project role definitions (EN + AR labels). */

export const ORG_ROLES = [
  "admin",
  "client",
  "contractor",
  "supervisor",
  "developer",
  "consultant",
  "project_manager",
] as const

export type OrgRole = (typeof ORG_ROLES)[number]

export const ROLE_LABELS: Record<
  OrgRole,
  { en: string; ar: string }
> = {
  admin: { en: "Admin", ar: "المسؤول" },
  client: { en: "Client / Employer", ar: "العميل / صاحب العمل" },
  contractor: { en: "Contractor", ar: "المقاول" },
  supervisor: { en: "Supervisor", ar: "المشرف" },
  developer: { en: "Developer", ar: "المطور" },
  consultant: { en: "Consultant", ar: "الاستشاري" },
  project_manager: { en: "Project Manager", ar: "مدير المشروع" },
}

export const ROLE_OPTIONS = ORG_ROLES.map((value) => ({
  value,
  label: `${ROLE_LABELS[value].en} / ${ROLE_LABELS[value].ar}`,
}))

/** Map legacy role names to the current set. */
export function normalizeRole(role: string): OrgRole {
  switch (role) {
    case "admin":
      return "admin"
    case "owner":
    case "client":
      return "client"
    case "contractor":
      return "contractor"
    case "supervisor":
    case "inspector":
      return "supervisor"
    case "developer":
      return "developer"
    case "consultant":
      return "consultant"
    case "manager":
    case "project_manager":
      return "project_manager"
    default:
      return "supervisor"
  }
}

export function isOrgRole(value: string): value is OrgRole {
  return (ORG_ROLES as readonly string[]).includes(value)
}
