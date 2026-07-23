import "server-only"
import { db } from "@/lib/db"
import { auditLog } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export async function writeAuditLog(params: {
  orgId: number
  userId?: string | null
  action: string
  module: string
  entityType?: string
  entityId?: string
  summary?: string
  meta?: Record<string, unknown>
}) {
  await db.insert(auditLog).values({
    orgId: params.orgId,
    userId: params.userId ?? null,
    action: params.action,
    module: params.module,
    entityType: params.entityType ?? null,
    entityId: params.entityId ?? null,
    summary: params.summary ?? null,
    meta: params.meta ?? {},
  })
}

export async function listAuditLogs(orgId: number, limit = 50) {
  return db
    .select()
    .from(auditLog)
    .where(eq(auditLog.orgId, orgId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit)
}
