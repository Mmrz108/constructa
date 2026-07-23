import { cn } from "@/lib/utils"

type Tone = "neutral" | "info" | "success" | "warning" | "danger"

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
}

const statusToTone: Record<string, Tone> = {
  // generic
  draft: "neutral",
  active: "success",
  completed: "success",
  closed: "success",
  rejected: "danger",
  archived: "neutral",
  on_hold: "warning",
  // inspection
  in_review: "info",
  approved: "success",
  // rejected already mapped
  scheduled: "info",
  // ncr / defect
  open: "warning",
  in_progress: "info",
  resolved: "success",
  verified: "success",
  // severity / priority
  critical: "danger",
  major: "danger",
  high: "danger",
  medium: "warning",
  minor: "info",
  low: "neutral",
  // result
  pass: "success",
  fail: "danger",
  na: "neutral",
  pending: "neutral",
}

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function StatusBadge({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const tone = statusToTone[value] ?? "neutral"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide",
        toneClass[tone],
        className,
      )}
    >
      {label(value)}
    </span>
  )
}
