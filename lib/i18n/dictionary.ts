export type Locale = "en" | "ar"

export const LOCALES: { value: Locale; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "ar", label: "Arabic", native: "العربية" },
]

type Dict = Record<string, string>

const en: Dict = {
  "nav.main": "Main",
  "nav.quality": "Quality & Site",
  "nav.dashboard": "Dashboard",
  "nav.project": "Project",
  "nav.stages": "Create Stages",
  "nav.users": "Users",
  "nav.inspections": "Inspections",
  "nav.ncrs": "NCRs",
  "nav.defects": "Defects & Snags",
  "nav.dailyReports": "Daily Reports",
  "nav.settings": "Settings",
  "nav.admin": "Admin",
  "nav.importExport": "Import / Export",
  "brand.name": "Bonyan",
  "lang.switch": "Language",
  "lang.en": "English",
  "lang.ar": "Arabic",
  "common.signOut": "Sign out",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "users.title": "Users",
  "users.description":
    "Manage users by role. Assign each user to one or more projects.",
  "users.add": "Add user",
  "users.role": "Role",
  "users.projects": "Projects",
  "users.access": "Access",
  "users.noProjects": "No projects",
}

const ar: Dict = {
  "nav.main": "الرئيسية",
  "nav.quality": "الجودة والموقع",
  "nav.dashboard": "لوحة التحكم",
  "nav.project": "المشاريع",
  "nav.stages": "إنشاء المراحل",
  "nav.users": "المستخدمون",
  "nav.inspections": "عمليات التفتيش",
  "nav.ncrs": "تقارير عدم المطابقة",
  "nav.defects": "العيوب والملاحظات",
  "nav.dailyReports": "التقارير اليومية",
  "nav.settings": "الإعدادات",
  "nav.admin": "الإدارة",
  "nav.importExport": "استيراد / تصدير",
  "brand.name": "بنيان",
  "lang.switch": "اللغة",
  "lang.en": "الإنجليزية",
  "lang.ar": "العربية",
  "common.signOut": "تسجيل الخروج",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "users.title": "المستخدمون",
  "users.description":
    "إدارة المستخدمين حسب الدور. يمكن تعيين كل مستخدم لعدة مشاريع.",
  "users.add": "إضافة مستخدم",
  "users.role": "الدور",
  "users.projects": "المشاريع",
  "users.access": "الوصول",
  "users.noProjects": "لا توجد مشاريع",
}

export const dictionaries: Record<Locale, Dict> = { en, ar }

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key
}

export const NAV_TITLE_KEYS: Record<string, string> = {
  Dashboard: "nav.dashboard",
  Project: "nav.project",
  "Create Stages": "nav.stages",
  Users: "nav.users",
  Inspections: "nav.inspections",
  NCRs: "nav.ncrs",
  "Defects & Snags": "nav.defects",
  "Daily Reports": "nav.dailyReports",
  Settings: "nav.settings",
  "Import / Export": "nav.importExport",
}

export const NAV_SECTION_KEYS: Record<string, string> = {
  Main: "nav.main",
  "Quality & Site": "nav.quality",
  Admin: "nav.admin",
}
