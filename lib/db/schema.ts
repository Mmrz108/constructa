import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
} from "drizzle-orm/pg-core"

// ---------- Better Auth tables (do not rename columns) ----------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// ---------- App tables ----------
export const organization = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerUserId: text("ownerUserId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const membership = pgTable("membership", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  orgId: integer("orgId").notNull(),
  role: text("role").notNull().default("supervisor"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  code: text("code"),
  client: text("client"),
  location: text("location"),
  status: text("status").notNull().default("active"),
  startDate: date("startDate"),
  endDate: date("endDate"),
  description: text("description"),
  contractor: text("contractor"),
  consultant: text("consultant"),
  ownerUserId: text("ownerUserId"),
  contractorUserId: text("contractorUserId"),
  supervisorUserId: text("supervisorUserId"),
  developerUserId: text("developerUserId"),
  handoverDate: date("handoverDate"),
  progressPlanned: integer("progressPlanned").notNull().default(0),
  progressActual: integer("progressActual").notNull().default(0),
  imageUrl: text("imageUrl"),
  rejectReason: text("rejectReason"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const progressSnapshot = pgTable("progress_snapshot", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  label: text("label").notNull(),
  planned: integer("planned").notNull().default(0),
  actual: integer("actual").notNull().default(0),
  sortOrder: integer("sortOrder").notNull().default(0),
})

export const inspection = pgTable("inspection", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull().default("quality"),
  location: text("location"),
  discipline: text("discipline"),
  status: text("status").notNull().default("draft"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: text("assignedTo"),
  scheduledFor: timestamp("scheduledFor"),
  notes: text("notes"),
  checklistTemplateId: integer("checklistTemplateId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const inspectionItem = pgTable("inspection_item", {
  id: serial("id").primaryKey(),
  inspectionId: integer("inspectionId").notNull(),
  userId: text("userId").notNull(),
  label: text("label").notNull(),
  result: text("result").notNull().default("pending"),
  comment: text("comment"),
  sortOrder: integer("sortOrder").notNull().default(0),
  questionType: text("questionType").notNull().default("pass_fail"),
  answer: jsonb("answer"),
  photoUrls: jsonb("photoUrls").notNull().default([]),
  options: jsonb("options").notNull().default([]),
  requirePhoto: boolean("requirePhoto").notNull().default(false),
  allowText: boolean("allowText").notNull().default(true),
})

export const checklistTemplate = pgTable("checklist_template", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  userId: text("userId").notNull(),
  projectId: integer("projectId"),
  supervisorUserId: text("supervisorUserId"),
  name: text("name").notNull(),
  discipline: text("discipline"),
  version: integer("version").notNull().default(1),
  items: jsonb("items").notNull().default([]),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Supervisor error reports surfaced on the dashboard. */
export const errorReport = pgTable("error_report", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  inspectionId: integer("inspectionId").notNull(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open | resolved
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const ncr = pgTable("ncr", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  stageId: integer("stageId"), // checklist_template id
  userId: text("userId").notNull(),
  inspectionId: integer("inspectionId"),
  number: text("number"),
  title: text("title").notNull(),
  description: text("description"),
  violatedStandard: text("violatedStandard"),
  location: text("location"),
  severity: text("severity").notNull().default("minor"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("open"),
  assignedTo: text("assignedTo"),
  dueDate: date("dueDate"),
  attachments: jsonb("attachments").notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const defect = pgTable("defect", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  stageId: integer("stageId"),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  category: text("category"),
  trade: text("trade"),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: text("assignedTo"),
  beforePhotoUrls: jsonb("beforePhotoUrls").notNull().default([]),
  afterPhotoUrls: jsonb("afterPhotoUrls").notNull().default([]),
  closeApprovedBy: text("closeApprovedBy"),
  closeApprovedAt: timestamp("closeApprovedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const dailyReport = pgTable("daily_report", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  stageId: integer("stageId"),
  userId: text("userId").notNull(),
  reportDate: date("reportDate").notNull(),
  weather: text("weather"),
  manpower: integer("manpower"),
  summary: text("summary"),
  workDone: text("workDone"),
  tomorrowPlan: text("tomorrowPlan"),
  equipment: text("equipment"),
  problemsRisks: text("problemsRisks"),
  incidents: text("incidents"),
  photoUrls: jsonb("photoUrls").notNull().default([]),
  supervisorSignature: text("supervisorSignature"),
  signedAt: timestamp("signedAt"),
  status: text("status").notNull().default("draft"), // draft | submitted | closed
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Per-project role assignment — a user can belong to many projects. */
export const projectMembership = pgTable("project_membership", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  role: text("role").notNull().default("supervisor"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Directory entries mirrored from legacy Bonyan (client / contractor / supervisor / leader). */
export const directoryContact = pgTable("directory_contact", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  type: text("type").notNull(), // client | contractor | supervisor | leader
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  refCode: text("refCode"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Site visit requests (pending / approved / rejected). */
export const siteVisitRequest = pgTable("site_visit_request", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId"),
  projectName: text("projectName"),
  requesterName: text("requesterName"),
  visitDate: date("visitDate"),
  visitTime: text("visitTime"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Finance / bank accounts list. */
export const financeAccount = pgTable("finance_account", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  accountType: text("accountType"),
  title: text("title").notNull(),
  accountNumber: text("accountNumber"),
  iban: text("iban"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Simple internal email / message log. */
export const emailMessage = pgTable("email_message", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  subject: text("subject").notNull(),
  recipient: text("recipient"),
  body: text("body"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/** Request for Information (RFI). */
export const rfi = pgTable("rfi", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  stageId: integer("stageId"),
  userId: text("userId").notNull(),
  number: text("number"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: text("assignedTo"),
  dueDate: date("dueDate"),
  attachments: jsonb("attachments").notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/** Variation Order (VO). */
export const variationOrder = pgTable("variation_order", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  number: text("number"),
  title: text("title").notNull(),
  description: text("description"),
  amount: text("amount"),
  status: text("status").notNull().default("draft"),
  attachments: jsonb("attachments").notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/** Interim Payment Certificate (IPC). */
export const ipc = pgTable("ipc", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  number: text("number"),
  title: text("title").notNull(),
  periodFrom: date("periodFrom"),
  periodTo: date("periodTo"),
  amount: text("amount"),
  status: text("status").notNull().default("draft"),
  attachments: jsonb("attachments").notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/**
 * Central organization settings hub (JSON document per org).
 * Modules should read defaults / permissions / branding from here.
 */
export const orgSettings = pgTable("org_settings", {
  orgId: integer("orgId").primaryKey(),
  data: jsonb("data").notNull().default({}),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  updatedBy: text("updatedBy"),
})

/** Administrative / security audit trail. */
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  userId: text("userId"),
  action: text("action").notNull(),
  module: text("module").notNull(),
  entityType: text("entityType"),
  entityId: text("entityId"),
  summary: text("summary"),
  meta: jsonb("meta").notNull().default({}),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

/**
 * Audit log for admin Import / Export jobs.
 * Stores a full report of imported / skipped / failed rows.
 */
export const dataTransferJob = pgTable("data_transfer_job", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  userId: text("userId").notNull(),
  direction: text("direction").notNull(), // import | export
  entity: text("entity").notNull(),
  source: text("source").notNull().default("file"), // file | api
  fileName: text("fileName"),
  status: text("status").notNull().default("completed"), // completed | failed | partial
  importedCount: integer("importedCount").notNull().default(0),
  skippedCount: integer("skippedCount").notNull().default(0),
  errorCount: integer("errorCount").notNull().default(0),
  report: jsonb("report").notNull().default({}),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
