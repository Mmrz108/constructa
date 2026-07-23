import "server-only"

const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED_EXT = new Set([".csv", ".xlsx", ".xls"])
const ALLOWED_MIME = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
])

export function assertSafeUpload(file: File) {
  if (!file || file.size <= 0) {
    throw new Error("No file uploaded.")
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File too large (max 8 MB).")
  }
  const name = file.name.toLowerCase()
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : ""
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Only .csv, .xlsx or .xls files are allowed.")
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    // Some browsers send empty or odd MIME — extension check is primary.
    if (file.type !== "" && !file.type.includes("sheet") && !file.type.includes("csv") && !file.type.includes("excel")) {
      throw new Error("Unsupported file type.")
    }
  }
}

export function sanitizeText(value: unknown, max = 4000): string {
  if (value == null) return ""
  return String(value)
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max)
}

export function sanitizeEmail(value: unknown): string {
  return sanitizeText(value, 320).toLowerCase()
}

/** Allow only http(s) URLs or app-relative /uploads paths. */
export function sanitizeUrlList(raw: string): string[] {
  if (!raw) return []
  return raw
    .split(/[|;,\n]/)
    .map((s) => sanitizeText(s, 2000))
    .filter(Boolean)
    .filter((u) => {
      if (u.startsWith("/uploads/")) return !u.includes("..")
      try {
        const parsed = new URL(u)
        return parsed.protocol === "http:" || parsed.protocol === "https:"
      } catch {
        return false
      }
    })
    .slice(0, 40)
}

export function parseJsonArray(raw: string): unknown[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Fallback: pipe/semicolon separated question labels
    return raw
      .split(/[|;]/)
      .map((s) => sanitizeText(s, 500))
      .filter(Boolean)
  }
}
