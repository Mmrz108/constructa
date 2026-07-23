"use client"

import { resolveErrorReport } from "@/app/actions/inspections"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, AlertTriangle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { toast } from "sonner"

export type ErrorAlertItem = {
  id: number
  title: string
  description: string
  createdAt: Date | string
  projectId: number
  projectName: string
  projectCode: string | null
  projectImageUrl: string | null
  inspectionId: number
}

export function DashboardErrorAlerts({ items }: { items: ErrorAlertItem[] }) {
  if (items.length === 0) return null

  return (
    <Card className="gap-4 border-destructive/40 bg-destructive/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-destructive">
            Error notifications
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Projects flagged by supervisor Error Reports from Inspections
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <ErrorAlertRow key={item.id} item={item} />
        ))}
      </ul>
    </Card>
  )
}

function ErrorAlertRow({ item }: { item: ErrorAlertItem }) {
  const [pending, startTransition] = useTransition()
  const when =
    typeof item.createdAt === "string"
      ? new Date(item.createdAt)
      : item.createdAt

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-card p-3 sm:flex-row sm:items-center">
      <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-md sm:h-14 sm:w-20">
        <Image
          src={item.projectImageUrl || "/images/project-hero.png"}
          alt={item.projectName}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.projectName}</p>
        {item.projectCode && (
          <p className="font-mono text-[10px] uppercase text-muted-foreground">
            {item.projectCode}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {when.toLocaleString()} ·{" "}
          <Link
            href={`/inspections/${item.inspectionId}`}
            className="underline-offset-2 hover:underline"
          >
            Open inspection
          </Link>
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            try {
              await resolveErrorReport(item.id)
              toast.success("Error marked as resolved")
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed")
            }
          })
        }}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Resolve
      </Button>
    </li>
  )
}
