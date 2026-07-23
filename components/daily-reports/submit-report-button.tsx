"use client"

import {
  closeDailyReport,
  submitDailyReport,
} from "@/app/actions/daily-reports"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Send } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

export function SubmitReportButton({
  id,
  status,
}: {
  id: number
  status: string
}) {
  const [pending, startTransition] = useTransition()

  if (status === "closed") {
    return (
      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
        Closed
      </Button>
    )
  }

  if (status === "submitted") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            try {
              await closeDailyReport(id)
              toast.success("Report closed")
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Close failed")
            }
          })
        }}
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Close
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await submitDailyReport(id)
            toast.success("Report submitted")
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Submit failed")
          }
        })
      }}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      Submit
    </Button>
  )
}
