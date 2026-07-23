import "server-only"
import * as XLSX from "xlsx"
import type { ParsedSheet } from "@/lib/import-export/types"
import { sanitizeText } from "@/lib/import-export/security"

function normalizeHeader(h: string) {
  return sanitizeText(h, 120)
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
}

function parseCsv(text: string): ParsedSheet {
  const wb = XLSX.read(text, { type: "string", raw: false })
  return sheetToParsed(wb.Sheets[wb.SheetNames[0]])
}

function sheetToParsed(sheet: XLSX.WorkSheet | undefined): ParsedSheet {
  if (!sheet) return { headers: [], rows: [] }
  const matrix = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  })
  if (!matrix.length) return { headers: [], rows: [] }

  const headerRow = (matrix[0] ?? []).map((c) => normalizeHeader(String(c ?? "")))
  const headers = headerRow.filter(Boolean)
  const rows: Record<string, string>[] = []

  for (let i = 1; i < matrix.length; i++) {
    const line = matrix[i] ?? []
    const obj: Record<string, string> = {}
    let any = false
    for (let c = 0; c < headerRow.length; c++) {
      const key = headerRow[c]
      if (!key) continue
      const val = sanitizeText(line[c] ?? "", 8000)
      obj[key] = val
      if (val) any = true
    }
    if (any) rows.push(obj)
  }

  return { headers, rows }
}

export async function parseUpload(file: File): Promise<ParsedSheet> {
  const name = file.name.toLowerCase()
  const buf = Buffer.from(await file.arrayBuffer())

  if (name.endsWith(".csv")) {
    const text = buf.toString("utf8").replace(/^\uFEFF/, "")
    return parseCsv(text)
  }

  const wb = XLSX.read(buf, { type: "buffer", cellDates: true })
  return sheetToParsed(wb.Sheets[wb.SheetNames[0]])
}

export function rowsToCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [headers.join(",")]
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","))
  }
  return lines.join("\n")
}

export function rowsToXlsxBuffer(
  headers: string[],
  rows: Record<string, unknown>[],
  sheetName = "export",
): Buffer {
  const data = rows.map((r) => {
    const o: Record<string, unknown> = {}
    for (const h of headers) o[h] = r[h] ?? ""
    return o
  })
  const ws = XLSX.utils.json_to_sheet(data, { header: headers })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }))
}

export function templateCsv(columns: string[]): string {
  return rowsToCsv(columns, [])
}
