import type { OrgRole } from "@/lib/roles"

export const SETTING_MODULES = [
  "projects",
  "users",
  "stages",
  "inspections",
  "ncrs",
  "defects",
  "daily_reports",
  "rfis",
  "vos",
  "ipcs",
  "settings",
  "import_export",
] as const

export type SettingModule = (typeof SETTING_MODULES)[number]

export const SETTING_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "export",
] as const

export type SettingAction = (typeof SETTING_ACTIONS)[number]

export type PermissionMatrix = Record<
  OrgRole,
  Partial<Record<SettingModule, SettingAction[]>>
>

export type OrgSettings = {
  general: {
    defaultLanguage: "en" | "ar"
    timezone: string
    dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
    measurementUnit: "metric" | "imperial"
    currency: string
    currencySymbol: string
  }
  company: {
    name: string
    nameAr: string
    address: string
    addressAr: string
    phone: string
    email: string
    website: string
    crNumber: string
    logoUrl: string
  }
  permissions: PermissionMatrix
  notifications: {
    emailEnabled: boolean
    inAppEnabled: boolean
    notifyOnInspection: boolean
    notifyOnNcr: boolean
    notifyOnDefect: boolean
    notifyOnDailyReport: boolean
    notifyOnRfi: boolean
    notifyOnVo: boolean
    notifyOnIpc: boolean
    digestDaily: boolean
    fromEmail: string
  }
  reports: {
    logoUrl: string
    headerEn: string
    headerAr: string
    footerEn: string
    footerAr: string
    signatureLabelEn: string
    signatureLabelAr: string
    signatureImageUrl: string
    pdfTemplate: "en" | "en_ar"
    showCompanyOnPdf: boolean
  }
  ai: {
    openaiApiKey: string
    openaiModel: string
    autoTranslate: boolean
    defaultReportLocale: "en" | "ar" | "en_ar"
  }
  importExport: {
    allowCsv: boolean
    allowXlsx: boolean
    allowPdfExport: boolean
    maxRows: number
    maxFileMb: number
    defaultUpsert: boolean
  }
}
