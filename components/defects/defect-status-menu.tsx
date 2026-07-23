"use client"

import { transitionDefect } from "@/app/actions/defects"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

const nextStatuses: Record<string, { value: string; label: string }[]> = {
  open: [
    { value: "in_progress", label: "Start work" },
    { value: "closed", label: "Close" },
  ],
  in_progress: [
    { value: "fixed", label: "Mark fixed" },
    { value: "open", label: "Re-open" },
  ],
  fixed: [
    { value: "verified", label: "Verify fix" },
    { value: "in_progress", label: "Send back" },
  ],
  verified: [
    { value: "closed", label: "Close" },
    { value: "in_progress", label: "Re-work" },
  ],
  closed: [],
}

export function DefectStatusMenu({
  id,
  status,
}: {
  id: number
  status: string
}) {
  const [pending, startTransition] = useTransition()
  const options = nextStatuses[status] ?? []

  if (options.length === 0) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
        Closed
      </Button>
    )
  }

  function move(to: string) {
    startTransition(async () => {
      try {
        await transitionDefect(id, to)
        toast.success("Defect updated")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" disabled={pending}>
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            Update
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onClick={() => move(o.value)}>
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
