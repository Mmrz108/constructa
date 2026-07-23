"use server"

import { db } from "@/lib/db"
import { dataTransferJob } from "@/lib/db/schema"
import { assertAdminRole, requireAdmin } from "@/lib/session"
import {
  ENTITY_META,
  TRANSFER_ENTITIES,
  type TransferEntity,
  type TransferReport,
} from "@/lib/import-export/types"
import { assertSafeUpload } from "@/lib/import-export/security"
import { parseUpload, templateCsv } from "@/lib/import-export/parse"
import { runEntityImport } from "@/lib/import-export/run-import"
import { runEntityExport } from "@/lib/import-export/run-export"
import { getOrgSettings, writeAuditLog, assertCan } from "@/lib/settings"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

function isEntity(v: string): v is TransferEntity {
  return (TRANSFER_ENTITIES as readonly string[]).includes(v)
}

export type ImportActionResult =
  | { ok: true; report: TransferReport }
  | { ok: false; error: string }

export async function importEntityFromFile(
  formData: FormData,
): Promise<ImportActionResult> {
  try {
    const ctx = await requireAdmin()
    assertAdminRole(ctx.role)
    const orgSettings = await getOrgSettings(ctx.orgId)
    assertCan(ctx.role, "import_export", "create", orgSettings.permissions)

    const entityRaw = String(formData.get("entity") ?? "")
    if (!isEntity(entityRaw)) {
      return { ok: false, error: "Invalid entity type." }
    }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return { ok: false, error: "Please choose a CSV or Excel file." }
    }

    const name = file.name.toLowerCase()
    if (name.endsWith(".csv") && !orgSettings.importExport.allowCsv) {
      return { ok: false, error: "CSV import is disabled in Settings." }
    }
    if (
      (name.endsWith(".xlsx") || name.endsWith(".xls")) &&
      !orgSettings.importExport.allowXlsx
    ) {
      return { ok: false, error: "Excel import is disabled in Settings." }
    }

    assertSafeUpload(file)
    const sheet = await parseUpload(file)
    if (!sheet.rows.length) {
      return { ok: false, error: "The file has no data rows." }
    }

    const upsert =
      String(formData.get("upsert") ?? "") === ""
        ? orgSettings.importExport.defaultUpsert
        : String(formData.get("upsert")) !== "false"

    const report = await runEntityImport({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      entity: entityRaw,
      rows: sheet.rows,
      fileName: file.name,
      options: {
        upsert,
        maxRows: orgSettings.importExport.maxRows,
      },
    })

    await writeAuditLog({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      action: "import.run",
      module: "import_export",
      entityType: entityRaw,
      summary: `Imported ${entityRaw}: ${report.imported} new, ${report.updated} updated, ${report.errors} errors`,
      meta: {
        fileName: file.name,
        imported: report.imported,
        updated: report.updated,
        skipped: report.skipped,
        errors: report.errors,
      },
    })

    revalidatePath("/import-export")
    revalidatePath("/settings")
    revalidatePath("/projects")
    revalidatePath("/stages")
    revalidatePath("/inspections")
    revalidatePath("/ncrs")
    revalidatePath("/defects")
    revalidatePath("/daily-reports")
    revalidatePath("/users")
    revalidatePath("/")

    return { ok: true, report }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Import failed",
    }
  }
}

export type ExportActionResult =
  | {
      ok: true
      fileName: string
      mime: string
      contentBase64: string
      rowCount: number
    }
  | { ok: false; error: string }

export async function exportEntityFile(
  formData: FormData,
): Promise<ExportActionResult> {
  try {
    const ctx = await requireAdmin()
    assertAdminRole(ctx.role)
    const orgSettings = await getOrgSettings(ctx.orgId)
    assertCan(ctx.role, "import_export", "export", orgSettings.permissions)

    const entityRaw = String(formData.get("entity") ?? "")
    if (!isEntity(entityRaw)) {
      return { ok: false, error: "Invalid entity type." }
    }

    const format = String(formData.get("format") ?? "csv") === "xlsx" ? "xlsx" : "csv"
    if (format === "csv" && !orgSettings.importExport.allowCsv) {
      return { ok: false, error: "CSV export is disabled in Settings." }
    }
    if (format === "xlsx" && !orgSettings.importExport.allowXlsx) {
      return { ok: false, error: "Excel export is disabled in Settings." }
    }

    const result = await runEntityExport({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      entity: entityRaw,
      format,
    })

    await writeAuditLog({
      orgId: ctx.orgId,
      userId: ctx.user.id,
      action: "export.run",
      module: "import_export",
      entityType: entityRaw,
      summary: `Exported ${entityRaw} (${format}) — ${result.rowCount} rows`,
      meta: { format, rowCount: result.rowCount, fileName: result.fileName },
    })

    revalidatePath("/import-export")
    revalidatePath("/settings")
    return { ok: true, ...result }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Export failed",
    }
  }
}

export async function getImportTemplate(entity: string) {
  const ctx = await requireAdmin()
  assertAdminRole(ctx.role)
  if (!isEntity(entity)) throw new Error("Invalid entity")
  const meta = ENTITY_META[entity]
  return {
    fileName: `template-${entity}.csv`,
    csv: templateCsv(meta.columns),
  }
}

export async function listTransferJobs(limit = 20) {
  const ctx = await requireAdmin()
  return db
    .select({
      id: dataTransferJob.id,
      direction: dataTransferJob.direction,
      entity: dataTransferJob.entity,
      fileName: dataTransferJob.fileName,
      status: dataTransferJob.status,
      importedCount: dataTransferJob.importedCount,
      skippedCount: dataTransferJob.skippedCount,
      errorCount: dataTransferJob.errorCount,
      createdAt: dataTransferJob.createdAt,
    })
    .from(dataTransferJob)
    .where(eq(dataTransferJob.orgId, ctx.orgId))
    .orderBy(desc(dataTransferJob.createdAt))
    .limit(limit)
}
