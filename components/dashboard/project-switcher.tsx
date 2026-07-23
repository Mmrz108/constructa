"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type ProjectThumb = {
  id: number
  name: string
  code: string | null
  imageUrl: string | null
}

export function DashboardProjectSwitcher({
  projects,
  selectedId,
}: {
  projects: ProjectThumb[]
  selectedId: number
}) {
  if (projects.length <= 1) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Projects</p>
        <Link
          href="/projects"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {projects.map((p) => {
          const active = p.id === selectedId
          return (
            <Link
              key={p.id}
              href={`/?project=${p.id}`}
              scroll={false}
              title={p.name}
              className={cn(
                "group flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 rounded-lg border p-1.5 transition-colors",
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
                  "w-full truncate text-center text-[10px] leading-tight",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {p.code || p.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
