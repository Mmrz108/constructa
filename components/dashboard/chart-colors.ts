/** Bright, lively palettes — distinct per donut so charts don't look alike. */

export const PROGRESS_COLORS = {
  planned: "#8B5CF6", // vivid violet
  actual: "#22D3EE", // bright cyan
  delay: "#FB7185", // lively rose
  remaining: "#C4B5FD", // soft lavender
  ahead: "#F0ABFC", // bright fuchsia
} as const

export const NCR_COLORS = {
  open: "#F97316", // vivid orange
  inReview: "#EAB308", // bright yellow/gold
  closed: "#14B8A6", // vivid teal
} as const

export const PROJECT_STATUS_COLORS = {
  inProgress: "#3B82F6", // bright blue
  completed: "#22C55E", // vivid green
  rejected: "#EF4444", // bright red
  empty: "#E2E8F0",
} as const
