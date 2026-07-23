"use client"

import { submitErrorReport } from "@/app/actions/inspections"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function ErrorReportButton({
  inspectionId,
  disabled,
}: {
  inspectionId: number
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [pending, startTransition] = useTransition()

  function onSubmit() {
    startTransition(async () => {
      try {
        await submitErrorReport(inspectionId, description)
        toast.success("Error report sent — visible on the dashboard")
        setOpen(false)
        setDescription("")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to submit report")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" disabled={disabled}>
            <AlertTriangle className="h-4 w-4" />
            Error Report
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error Report</DialogTitle>
          <DialogDescription>
            Complete all form answers (and required photos) first, then describe
            the issue. This will notify the dashboard for this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="error-desc">Description</Label>
          <Textarea
            id="error-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the error / non-conformance found on site…"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={pending || !description.trim()}
            onClick={onSubmit}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            Submit error report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
