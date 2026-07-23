export const TRANSFER_ENTITIES = [
  "organizations",
  "users",
  "clients",
  "contractors",
  "subcontractors",
  "developers",
  "supervisors",
  "projects",
  "stages",
  "inspections",
  "ncrs",
  "defects",
  "daily_reports",
  "rfis",
  "vos",
  "ipcs",
] as const

export type TransferEntity = (typeof TRANSFER_ENTITIES)[number]

export type RowStatus = "imported" | "updated" | "skipped" | "error"

export type RowResult = {
  row: number
  status: RowStatus
  key?: string
  message: string
}

export type TransferReport = {
  entity: TransferEntity
  fileName?: string
  totalRows: number
  imported: number
  updated: number
  skipped: number
  errors: number
  rows: RowResult[]
  startedAt: string
  finishedAt: string
}

export type ParsedSheet = {
  headers: string[]
  rows: Record<string, string>[]
}

export type ImportOptions = {
  /** When true, update existing records matched by natural key. */
  upsert: boolean
  /** Max rows processed per job (hard cap). */
  maxRows: number
}

export const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
  upsert: true,
  maxRows: 5000,
}

export type EntityMeta = {
  key: TransferEntity
  label: string
  description: string
  /** Columns expected in CSV/XLSX templates (order preserved). */
  columns: string[]
  /** Natural key columns used for duplicate detection. */
  naturalKeys: string[]
}

export const ENTITY_META: Record<TransferEntity, EntityMeta> = {
  organizations: {
    key: "organizations",
    label: "Organizations",
    description: "Organization / tenant records",
    columns: ["external_id", "name", "owner_email"],
    naturalKeys: ["name"],
  },
  users: {
    key: "users",
    label: "Users",
    description: "Login users with org role",
    columns: [
      "email",
      "name",
      "role",
      "password",
      "project_codes",
    ],
    naturalKeys: ["email"],
  },
  clients: {
    key: "clients",
    label: "Clients",
    description: "Client / employer directory",
    columns: ["ref_code", "name", "email", "phone", "notes"],
    naturalKeys: ["email", "ref_code"],
  },
  contractors: {
    key: "contractors",
    label: "Contractors",
    description: "Main contractor directory",
    columns: ["ref_code", "name", "email", "phone", "notes"],
    naturalKeys: ["email", "ref_code"],
  },
  subcontractors: {
    key: "subcontractors",
    label: "Subcontractors",
    description: "Subcontractor directory",
    columns: ["ref_code", "name", "email", "phone", "notes"],
    naturalKeys: ["email", "ref_code"],
  },
  developers: {
    key: "developers",
    label: "Developers",
    description: "Developer directory",
    columns: ["ref_code", "name", "email", "phone", "notes"],
    naturalKeys: ["email", "ref_code"],
  },
  supervisors: {
    key: "supervisors",
    label: "Supervisors",
    description: "Supervisor directory",
    columns: ["ref_code", "name", "email", "phone", "notes"],
    naturalKeys: ["email", "ref_code"],
  },
  projects: {
    key: "projects",
    label: "Projects",
    description: "Projects with codes and links",
    columns: [
      "code",
      "name",
      "client",
      "location",
      "status",
      "description",
      "contractor",
      "consultant",
      "image_url",
      "owner_email",
      "contractor_email",
      "supervisor_email",
      "developer_email",
    ],
    naturalKeys: ["code"],
  },
  stages: {
    key: "stages",
    label: "Stages",
    description: "Stage / checklist templates and questions",
    columns: [
      "name",
      "discipline",
      "project_code",
      "items_json",
      "is_active",
    ],
    naturalKeys: ["name", "project_code"],
  },
  inspections: {
    key: "inspections",
    label: "Inspection Reports",
    description: "Inspections linked to project + stage",
    columns: [
      "external_id",
      "project_code",
      "stage_name",
      "title",
      "type",
      "location",
      "discipline",
      "status",
      "priority",
      "assigned_to",
      "scheduled_for",
      "notes",
      "photo_urls",
    ],
    naturalKeys: ["external_id", "project_code", "title"],
  },
  ncrs: {
    key: "ncrs",
    label: "NCRs",
    description: "Non-conformance reports",
    columns: [
      "number",
      "project_code",
      "stage_name",
      "title",
      "description",
      "violated_standard",
      "location",
      "severity",
      "priority",
      "status",
      "assigned_to",
      "due_date",
      "attachment_urls",
    ],
    naturalKeys: ["number", "project_code"],
  },
  defects: {
    key: "defects",
    label: "Defects & Snags",
    description: "Defects with before/after photo URLs",
    columns: [
      "external_id",
      "project_code",
      "stage_name",
      "title",
      "description",
      "location",
      "category",
      "trade",
      "status",
      "priority",
      "assigned_to",
      "before_photo_urls",
      "after_photo_urls",
    ],
    naturalKeys: ["external_id", "project_code", "title"],
  },
  daily_reports: {
    key: "daily_reports",
    label: "Daily Reports",
    description: "Daily site reports",
    columns: [
      "project_code",
      "stage_name",
      "report_date",
      "weather",
      "manpower",
      "summary",
      "work_done",
      "tomorrow_plan",
      "equipment",
      "problems_risks",
      "incidents",
      "photo_urls",
      "status",
    ],
    naturalKeys: ["project_code", "report_date"],
  },
  rfis: {
    key: "rfis",
    label: "RFIs",
    description: "Requests for Information",
    columns: [
      "number",
      "project_code",
      "stage_name",
      "title",
      "description",
      "status",
      "priority",
      "assigned_to",
      "due_date",
      "attachment_urls",
    ],
    naturalKeys: ["number", "project_code"],
  },
  vos: {
    key: "vos",
    label: "Variation Orders (VO)",
    description: "Variation / change orders",
    columns: [
      "number",
      "project_code",
      "title",
      "description",
      "amount",
      "status",
      "attachment_urls",
    ],
    naturalKeys: ["number", "project_code"],
  },
  ipcs: {
    key: "ipcs",
    label: "IPCs",
    description: "Interim Payment Certificates",
    columns: [
      "number",
      "project_code",
      "title",
      "period_from",
      "period_to",
      "amount",
      "status",
      "attachment_urls",
    ],
    naturalKeys: ["number", "project_code"],
  },
}
