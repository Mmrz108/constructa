import { mkdir, writeFile } from "fs/promises"
import path from "path"

function useDataUrlStorage() {
  // Vercel filesystem is ephemeral — keep small images in the DB as data URLs.
  return process.env.VERCEL === "1" || process.env.UPLOAD_MODE === "data"
}

/** Save an uploaded image and return a public URL (or data URL on Vercel). */
export async function saveUploadedImage(
  file: File,
  folder: string,
  prefix = "file",
): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("A file is required")
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File must be under 8 MB")
  }
  const type = file.type || ""
  if (!type.startsWith("image/")) {
    throw new Error("Only image files are allowed")
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (useDataUrlStorage() || folder === "avatars") {
    const mime = type || "image/jpeg"
    return `data:${mime};base64,${buffer.toString("base64")}`
  }

  const ext =
    type === "image/png"
      ? "png"
      : type === "image/webp"
        ? "webp"
        : type === "image/gif"
          ? "gif"
          : "jpg"

  const dir = path.join(process.cwd(), "public", "uploads", folder)
  await mkdir(dir, { recursive: true })
  const filename = `${prefix}-${Date.now()}.${ext}`
  await writeFile(path.join(dir, filename), buffer)
  return `/uploads/${folder}/${filename}`
}

export async function saveUploadedFiles(
  formData: FormData,
  field: string,
  folder: string,
): Promise<string[]> {
  const entries = formData.getAll(field)
  const urls: string[] = []
  let i = 0
  for (const entry of entries) {
    if (entry instanceof File && entry.size > 0) {
      urls.push(await saveUploadedImage(entry, folder, `${field}-${i++}`))
    }
  }
  return urls
}
