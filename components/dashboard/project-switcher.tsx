"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ProjectThumb = {
  id: number
  name: string
  code: string | null
  imageUrl: string | null
}

/** Short label from code: BONYAN_2025-117 → 2025-117 */
function shortCode(code: string | null | undefined) {
  if (!code) return null
  return code.replace(/^BONYAN[_-]?/i, "") || code
}

export function DashboardProjectSwitcher({
  projects,
  selectedId,
}: {
  projects: ProjectThumb[]
  selectedId: number
}) {
  const router = useRouter()
  if (projects.length <= 1) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Projects</p>
        <div className="flex items-center gap-2">
          <Select
            value={String(selectedId)}
            onValueChange={(v) => {
              if (v) router.push(`/?project=${v}`)
            }}
            items={projects.map((p) => ({
              value: String(p.id),
              label: shortCode(p.code)
                ? `${p.name} (${shortCode(p.code)})`
                : p.name,
            }))}
          >
            <SelectTrigger className="h-8 w-[min(100%,20rem)] max-w-full text-xs sm:text-sm">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent align="end" className="max-h-72">
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {shortCode(p.code)
                    ? `${p.name} (${shortCode(p.code)})`
                    : p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link
            href="/projects"
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {projects.map((p) => {
          const active = p.id === selectedId
          const codeShort = shortCode(p.code)
          return (
            <Link
              key={p.id}
              href={`/?project=${p.id}`}
              scroll={false}
              title={`${p.name}${p.code ? ` (${p.code})` : ""}`}
              className={cn(
                "group flex w-28 shrink-0 flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-transparent hover:border-border hover:bg-muted/50",
              )}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                <Image
                  src={p.imageUrl || "/images/project-hero.png"}
                  alt={p.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span
                className={cn(
                  "line-clamp-2 w-full text-center text-[11px] leading-tight",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {p.name}
              </span>
              {codeShort && (
                <span className="w-full truncate text-center font-mono text-[9px] text-muted-foreground">
                  {codeShort}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
