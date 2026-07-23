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
})

export const checklistTemplate = pgTable("checklist_template", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  discipline: text("discipline"),
  version: integer("version").notNull().default(1),
  items: jsonb("items").notNull().default([]),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const ncr = pgTable("ncr", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  inspectionId: integer("inspectionId"),
  number: text("number"),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").notNull().default("minor"),
  status: text("status").notNull().default("open"),
  assignedTo: text("assignedTo"),
  dueDate: date("dueDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const defect = pgTable("defect", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  trade: text("trade"),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: text("assignedTo"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const dailyReport = pgTable("daily_report", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").notNull(),
  projectId: integer("projectId").notNull(),
  userId: text("userId").notNull(),
  reportDate: date("reportDate").notNull(),
  weather: text("weather"),
  manpower: integer("manpower"),
  summary: text("summary"),
  workDone: text("workDone"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
