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
type StageOption = { id: number; name: string; projectId: number | null }

export function CreateDailyReportDialog({
  projects,
  stages = [],
}: {
  projects: ProjectOption[]
  stages?: StageOption[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [projectId, setProjectId] = useState("")

  const projectItems = useMemo(
    () => projects.map((p) => ({ value: String(p.id), label: p.name })),
    [projects],
  )

  const stageItems = useMemo(() => {
    const pid = Number(projectId)
    const filtered = stages.filter((s) => !s.projectId || s.projectId === pid)
    return [
      { value: "none", label: "No stage" },
      ...filtered.map((s) => ({ value: String(s.id), label: s.name })),
    ]
  }, [stages, projectId])

  function onSubmit(formData: FormData) {
    if (projectId) formData.set("projectId", projectId)
    const stageId = String(formData.get("stageId") ?? "")
    if (!stageId || stageId === "none") formData.delete("stageId")

    startTransition(async () => {
      try {
        await createDailyReport(formData)
        toast.success("Daily report created")
        setOpen(false)
        setProjectId("")
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
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <form action={onSubmit} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle>Daily site report</DialogTitle>
            <DialogDescription>
              Weather, manpower, work done, tomorrow plan, equipment,
              problems/risks, incidents, photos, and supervisor signature.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Project</Label>
                <Select
                  value={projectId}
                  onValueChange={(v) => setProjectId(v ?? "")}
                  items={projectItems}
                  required
                >
                  <SelectTrigger className="w-full">
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="stageId">Stage</Label>
              <Select
                name="stageId"
                defaultValue="none"
                items={stageItems}
                disabled={!projectId}
              >
                <SelectTrigger id="stageId" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageItems.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="workDone">Work completed today</Label>
              <Textarea id="workDone" name="workDone" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tomorrowPlan">Tomorrow&apos;s plan</Label>
              <Textarea id="tomorrowPlan" name="tomorrowPlan" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="equipment">Equipment on site</Label>
              <Textarea id="equipment" name="equipment" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="problemsRisks">Problems & risks</Label>
              <Textarea id="problemsRisks" name="problemsRisks" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="incidents">Incidents</Label>
              <Textarea
                id="incidents"
                name="incidents"
                rows={2}
                placeholder="Safety / quality incidents (or None)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="photos">Daily photos</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="supervisorSignature">
                Supervisor signature (type full name)
              </Label>
              <Input
                id="supervisorSignature"
                name="supervisorSignature"
                placeholder="Supervisor full name"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending || !projectId}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
