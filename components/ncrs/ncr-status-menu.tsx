"use client"

import { transitionNcr } from "@/app/actions/ncrs"
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
    { value: "in_progress", label: "Start corrective action" },
    { value: "closed", label: "Close" },
  ],
  in_progress: [
    { value: "resolved", label: "Mark resolved" },
    { value: "open", label: "Re-open" },
  ],
  resolved: [
    { value: "closed", label: "Verify & close" },
    { value: "in_progress", label: "Send back" },
  ],
  closed: [],
}

export function NcrStatusMenu({ id, status }: { id: number; status: string }) {
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
        await transitionNcr(id, to)
        toast.success("NCR updated")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={pending}>
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          Update
        </Button>
      </DropdownMenuTrigger>
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
