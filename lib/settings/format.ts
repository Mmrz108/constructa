import type { OrgSettings } from "@/lib/settings/types"

/** Format a date using org general defaults (central hub). */
export function formatOrgDate(
  value: Date | string | null | undefined,
  settings: Pick<OrgSettings, "general">,
  locale?: string,
): string {
  if (!value) return "—"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "—"

  const fmt = settings.general.dateFormat
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()

  switch (fmt) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`
  }
}

export function formatOrgMoney(
  amount: number | string | null | undefined,
  settings: Pick<OrgSettings, "general">,
): string {
  if (amount == null || amount === "") return "—"
  const n = typeof amount === "number" ? amount : Number(amount)
  if (Number.isNaN(n)) return String(amount)
  const formatted = n.toLocaleString("en-OM", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  })
  return `${settings.general.currencySymbol} ${formatted}`.trim()
}

/** Branding payload for PDF / report generators. */
export function getReportBranding(settings: OrgSettings) {
  return {
    companyName: settings.company.name,
    companyNameAr: settings.company.nameAr,
    address: settings.company.address,
    addressAr: settings.company.addressAr,
    phone: settings.company.phone,
    email: settings.company.email,
    website: settings.company.website,
    crNumber: settings.company.crNumber,
    logoUrl: settings.reports.logoUrl || settings.company.logoUrl,
    headerEn: settings.reports.headerEn,
    headerAr: settings.reports.headerAr,
    footerEn: settings.reports.footerEn,
    footerAr: settings.reports.footerAr,
    signatureLabelEn: settings.reports.signatureLabelEn,
    signatureLabelAr: settings.reports.signatureLabelAr,
    signatureImageUrl: settings.reports.signatureImageUrl,
    pdfTemplate: settings.reports.pdfTemplate,
    showCompanyOnPdf: settings.reports.showCompanyOnPdf,
    timezone: settings.general.timezone,
    dateFormat: settings.general.dateFormat,
    currency: settings.general.currency,
    locale: settings.general.defaultLanguage,
  }
}
