"use client"

import { submitDailyReport } from "@/app/actions/daily-reports"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
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

  if (status === "submitted") {
    return (
      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
        Submitted
      </Button>
    )
  }

  function submit() {
    startTransition(async () => {
      try {
        await submitDailyReport(id)
        toast.success("Report submitted")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Submit failed")
      }
    })
  }

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={submit}>
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      Submit
    </Button>
  )
}
