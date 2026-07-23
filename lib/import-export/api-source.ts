import "server-only"
import type { ParsedSheet, TransferEntity } from "@/lib/import-export/types"

/**
 * Future API-based migration adapter.
 * Implementations should fetch remote pages and return normalized sheets
 * that can be fed into `runEntityImport` without changing UI or importers.
 */
export type ApiMigrationSource = {
  id: string
  label: string
  fetchEntity(entity: TransferEntity): Promise<ParsedSheet>
}

/** Placeholder registry — wire real connectors here later. */
export const API_MIGRATION_SOURCES: ApiMigrationSource[] = []

export function getApiMigrationSource(id: string) {
  return API_MIGRATION_SOURCES.find((s) => s.id === id) ?? null
}
