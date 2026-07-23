"use client"

import { createDailyReport } from "@/app/actions/daily-reports"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = { id: number; name: string }

export function CreateDailyReportDialog({
  projects,
}: {
  projects: ProjectOption[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const projectItems = useMemo(
    () => projects.map((p) => ({ value: String(p.id), label: p.name })),
    [projects],
  )

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createDailyReport(formData)
        toast.success("Daily report created")
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create report")
      }
    })
  }

  const disabled = projects.length === 0
  const today = new Date().toISOString().slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button disabled={disabled}>
            <Plus className="h-4 w-4" />
            New report
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>New daily site report</DialogTitle>
            <DialogDescription>
              Record site activity, manpower, and progress for the day.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="projectId">Project</Label>
                <Select name="projectId" required items={projectItems}>
                  <SelectTrigger id="projectId" className="w-full">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectItems.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reportDate">Date</Label>
                <Input
                  id="reportDate"
                  name="reportDate"
                  type="date"
                  required
                  defaultValue={today}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="weather">Weather</Label>
                <Input id="weather" name="weather" placeholder="Clear, 32°C" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="manpower">Manpower (headcount)</Label>
                <Input
                  id="manpower"
                  name="manpower"
                  type="number"
                  min="0"
                  placeholder="45"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workDone">Work completed</Label>
              <Textarea
                id="workDone"
                name="workDone"
                rows={3}
                placeholder="Concrete pour Level 3, blockwork Zone B..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="summary">Summary / issues</Label>
              <Textarea
                id="summary"
                name="summary"
                rows={2}
                placeholder="Delays, deliveries, safety notes..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
