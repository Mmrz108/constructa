/** Shared types for project stage forms (Create Stages → Inspection). */

export type QuestionType =
  | "text"
  | "single_choice"
  | "multi_choice"
  | "checkbox"
  | "pass_fail"
  | "photo"

export type StageQuestion = {
  id: string
  label: string
  type: QuestionType
  options?: string[]
  /** Raw options string while typing in the form builder (preserves commas). */
  optionsRaw?: string
  required?: boolean
  requirePhoto?: boolean
  /** Supervisor can add free-text together with the primary answer. */
  allowText?: boolean
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Text answer",
  single_choice: "Single choice",
  multi_choice: "Multiple choice",
  checkbox: "Checkbox (Yes / No)",
  pass_fail: "Pass / Fail / N/A",
  photo: "Photo only",
}

export function newQuestionId() {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Normalize legacy string[] templates and structured questions. */
export function normalizeStageQuestions(items: unknown): StageQuestion[] {
  if (!Array.isArray(items)) return []
  return items
    .map((raw, idx): StageQuestion | null => {
      if (typeof raw === "string") {
        const label = raw.trim()
        if (!label) return null
        return {
          id: `legacy_${idx}`,
          label,
          type: "pass_fail",
          required: true,
          requirePhoto: false,
          allowText: true,
        }
      }
      if (!raw || typeof raw !== "object") return null
      const q = raw as Record<string, unknown>
      const label = String(q.label ?? "").trim()
      if (!label) return null
      const type = (String(q.type ?? "pass_fail") as QuestionType) || "pass_fail"
      const options = Array.isArray(q.options)
        ? q.options.map((o) => String(o).trim()).filter(Boolean)
        : []
      return {
        id: String(q.id ?? `q_${idx}`),
        label,
        type: isQuestionType(type) ? type : "pass_fail",
        options,
        required: q.required !== false,
        requirePhoto: Boolean(q.requirePhoto) || type === "photo",
        allowText: q.allowText !== false,
      }
    })
    .filter((q): q is StageQuestion => q !== null)
}

function isQuestionType(v: string): v is QuestionType {
  return (
    v === "text" ||
    v === "single_choice" ||
    v === "multi_choice" ||
    v === "checkbox" ||
    v === "pass_fail" ||
    v === "photo"
  )
}

export function isItemAnswered(item: {
  questionType: string
  result: string
  answer: unknown
  photoUrls: unknown
  requirePhoto: boolean
}): boolean {
  const photos = Array.isArray(item.photoUrls)
    ? (item.photoUrls as string[])
    : []
  if (item.requirePhoto && photos.length === 0) return false

  switch (item.questionType) {
    case "pass_fail":
      return item.result !== "pending"
    case "checkbox":
      return item.answer === true || item.answer === false
    case "text":
      return typeof item.answer === "string" && item.answer.trim().length > 0
    case "single_choice":
      return typeof item.answer === "string" && item.answer.trim().length > 0
    case "multi_choice":
      return Array.isArray(item.answer) && item.answer.length > 0
    case "photo":
      return photos.length > 0
    default:
      return item.result !== "pending"
  }
}
