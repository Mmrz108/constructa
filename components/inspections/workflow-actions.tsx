"use client"

import { transitionInspection } from "@/app/actions/inspections"
import { Button } from "@/components/ui/button"
import { Send, Check, X, RotateCcw, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

export function WorkflowActions({
  inspectionId,
  status,
}: {
  inspectionId: number
  status: string
}) {
  const [pending, startTransition] = useTransition()

  function go(to: string, successMsg: string) {
    startTransition(async () => {
      try {
        await transitionInspection(inspectionId, to)
        toast.success(successMsg)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Action failed")
      }
    })
  }

  if (status === "draft") {
    return (
      <Button onClick={() => go("in_review", "Submitted for review")} disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit for review
      </Button>
    )
  }

  if (status === "in_review") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => go("rejected", "Inspection rejected")}
          disabled={pending}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
        <Button
          onClick={() => go("approved", "Inspection approved")}
          disabled={pending}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve
        </Button>
      </div>
    )
  }

  if (status === "rejected") {
    return (
      <Button onClick={() => go("in_review", "Re-submitted for review")} disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
        Re-submit
      </Button>
    )
  }

  return null
}
