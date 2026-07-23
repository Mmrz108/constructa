import type { OrgSettings, PermissionMatrix } from "@/lib/settings/types"
import { ORG_ROLES, type OrgRole } from "@/lib/roles"

const all = ["view", "create", "edit", "delete", "approve", "export"] as const
const viewExport = ["view", "export"] as const
const viewOnly = ["view"] as const
const fieldOps = ["view", "create", "edit", "export"] as const
const quality = ["view", "create", "edit", "approve", "export"] as const

function rolePerms(
  overrides: Partial<PermissionMatrix[OrgRole]>,
): PermissionMatrix[OrgRole] {
  return {
    projects: [...viewOnly],
    users: [],
    stages: [...viewOnly],
    inspections: [...viewOnly],
    ncrs: [...viewOnly],
    defects: [...viewOnly],
    daily_reports: [...viewOnly],
    rfis: [...viewOnly],
    vos: [...viewOnly],
    ipcs: [...viewOnly],
    settings: [],
    import_export: [],
    ...overrides,
  }
}

export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  admin: rolePerms({
    projects: [...all],
    users: [...all],
    stages: [...all],
    inspections: [...all],
    ncrs: [...all],
    defects: [...all],
    daily_reports: [...all],
    rfis: [...all],
    vos: [...all],
    ipcs: [...all],
    settings: [...all],
    import_export: [...all],
  }),
  project_manager: rolePerms({
    projects: [...fieldOps, "approve"],
    users: ["view", "create", "edit"],
    stages: [...fieldOps],
    inspections: [...quality],
    ncrs: [...quality],
    defects: [...quality],
    daily_reports: [...fieldOps],
    rfis: [...quality],
    vos: [...quality],
    ipcs: [...quality],
    settings: ["view"],
    import_export: ["view", "export"],
  }),
  supervisor: rolePerms({
    projects: [...viewOnly],
    stages: [...viewOnly],
    inspections: [...quality],
    ncrs: [...quality],
    defects: [...quality],
    daily_reports: [...fieldOps],
    rfis: [...fieldOps],
    vos: [...viewOnly],
    ipcs: [...viewOnly],
    settings: [...viewOnly],
  }),
  consultant: rolePerms({
    projects: [...viewOnly],
    inspections: [...viewExport, "approve"],
    ncrs: [...viewExport, "approve"],
    defects: [...viewExport, "approve"],
    daily_reports: [...viewExport],
    rfis: [...viewExport, "approve"],
    vos: [...viewExport],
    ipcs: [...viewExport],
    settings: [...viewOnly],
  }),
  contractor: rolePerms({
    projects: [...viewOnly],
    inspections: [...viewOnly],
    ncrs: ["view", "edit", "export"],
    defects: ["view", "edit", "export"],
    daily_reports: [...fieldOps],
    rfis: ["view", "create", "edit"],
    vos: [...viewOnly],
    ipcs: [...viewOnly],
    settings: [...viewOnly],
  }),
  developer: rolePerms({
    projects: [...viewOnly],
    inspections: [...viewExport],
    ncrs: [...viewExport],
    defects: [...viewExport],
    daily_reports: [...viewExport],
    rfis: [...viewExport],
    vos: [...viewExport],
    ipcs: [...viewExport],
    settings: [...viewOnly],
  }),
  client: rolePerms({
    projects: [...viewOnly],
    inspections: [...viewOnly],
    ncrs: [...viewOnly],
    defects: [...viewOnly],
    daily_reports: [...viewOnly],
    rfis: [...viewOnly],
    vos: [...viewOnly],
    ipcs: [...viewOnly],
    settings: [...viewOnly],
  }),
}

export const DEFAULT_ORG_SETTINGS: OrgSettings = {
  general: {
    defaultLanguage: "en",
    timezone: "Asia/Muscat",
    dateFormat: "DD/MM/YYYY",
    measurementUnit: "metric",
    currency: "OMR",
    currencySymbol: "ر.ع.",
  },
  company: {
    name: "Bonyan Construction & Engineering Consultancy",
    nameAr: "بنيان للاستشارات الهندسية والإنشائية",
    address: "",
    addressAr: "",
    phone: "",
    email: "",
    website: "",
    crNumber: "",
    logoUrl: "/bonyan-logo.png",
  },
  permissions: DEFAULT_PERMISSIONS,
  notifications: {
    emailEnabled: false,
    inAppEnabled: true,
    notifyOnInspection: true,
    notifyOnNcr: true,
    notifyOnDefect: true,
    notifyOnDailyReport: true,
    notifyOnRfi: true,
    notifyOnVo: true,
    notifyOnIpc: true,
    digestDaily: false,
    fromEmail: "",
  },
  reports: {
    logoUrl: "/bonyan-logo.png",
    headerEn: "Bonyan Construction — Supervision Report",
    headerAr: "بنيان — تقرير الإشراف",
    footerEn: "Confidential — For project use only",
    footerAr: "سري — للاستخدام في المشروع فقط",
    signatureLabelEn: "Authorized signature",
    signatureLabelAr: "التوقيع المعتمد",
    signatureImageUrl: "",
    pdfTemplate: "en_ar",
    showCompanyOnPdf: true,
  },
  ai: {
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    autoTranslate: false,
    defaultReportLocale: "en_ar",
  },
  importExport: {
    allowCsv: true,
    allowXlsx: true,
    allowPdfExport: true,
    maxRows: 5000,
    maxFileMb: 8,
    defaultUpsert: true,
  },
}

export function mergeSettings(partial?: Partial<OrgSettings> | null): OrgSettings {
  const base = structuredClone(DEFAULT_ORG_SETTINGS)
  if (!partial) return base

  return {
    general: { ...base.general, ...(partial.general ?? {}) },
    company: { ...base.company, ...(partial.company ?? {}) },
    notifications: { ...base.notifications, ...(partial.notifications ?? {}) },
    reports: { ...base.reports, ...(partial.reports ?? {}) },
    ai: { ...base.ai, ...(partial.ai ?? {}) },
    importExport: { ...base.importExport, ...(partial.importExport ?? {}) },
    permissions: mergePermissions(base.permissions, partial.permissions),
  }
}

function mergePermissions(
  base: PermissionMatrix,
  override?: PermissionMatrix,
): PermissionMatrix {
  if (!override) return base
  const out = structuredClone(base)
  for (const role of ORG_ROLES) {
    if (override[role]) {
      out[role] = { ...out[role], ...override[role] }
    }
  }
  return out
}
