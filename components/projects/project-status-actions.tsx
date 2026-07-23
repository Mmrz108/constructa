"use client"

import {
  continueProject,
  finishProject,
  rejectProject,
} from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2, RotateCcw, X } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function ProjectStatusActions({
  projectId,
  status,
}: {
  projectId: number
  status: string
}) {
  const [pending, startTransition] = useTransition()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState("")

  function run(action: () => Promise<void>, successMsg: string) {
    startTransition(async () => {
      try {
        await action()
        toast.success(successMsg)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Action failed")
      }
    })
  }

  if (status === "rejected") {
    return (
      <Button
        onClick={() =>
          run(() => continueProject(projectId), "Project resumed")
        }
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        Continue work
      </Button>
    )
  }

  if (status === "completed" || status === "archived") {
    return null
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setReason("")
            setRejectOpen(true)
          }}
          disabled={pending}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
        <Button
          onClick={() =>
            run(() => finishProject(projectId), "Project finished")
          }
          disabled={pending}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Finish
        </Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject project</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this project. The reason
              will be visible on the project details page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this project is being rejected…"
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending || !reason.trim()}
              onClick={() => {
                run(async () => {
                  await rejectProject(projectId, reason)
                  setRejectOpen(false)
                  setReason("")
                }, "Project rejected")
              }}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
