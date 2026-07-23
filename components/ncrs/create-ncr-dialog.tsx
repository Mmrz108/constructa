"use client"

import { createNcr } from "@/app/actions/ncrs"
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

const SEVERITY_ITEMS = [
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
]

const PRIORITY_ITEMS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export function CreateNcrDialog({
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
        await createNcr(formData)
        toast.success("NCR raised")
        setOpen(false)
        setProjectId("")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to raise NCR")
      }
    })
  }

  const disabled = projects.length === 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button disabled={disabled}>
            <Plus className="h-4 w-4" />
            Raise NCR
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <form action={onSubmit} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle>Raise non-conformance report</DialogTitle>
            <DialogDescription>
              Record the non-conformance, violated standard, location, owner,
              due date, priority, and attachments. Linked to project and stage.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Non-conformance title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Concrete honeycombing at column C-4"
              />
            </div>
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
                <Label htmlFor="stageId">Stage</Label>
                <Select
                  name="stageId"
                  defaultValue="none"
                  items={stageItems}
                  disabled={!projectId}
                >
                  <SelectTrigger id="stageId" className="w-full">
                    <SelectValue placeholder="Select stage" />
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
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Problem description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                required
                placeholder="Describe the non-conformance and required corrective action…"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="violatedStandard">Violated standard</Label>
                <Input
                  id="violatedStandard"
                  name="violatedStandard"
                  placeholder="ACI 318 / Spec section…"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Block B, Level 2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="assignedTo">Responsible for fix</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  placeholder="Contractor / party"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  name="severity"
                  defaultValue="minor"
                  items={SEVERITY_ITEMS}
                >
                  <SelectTrigger id="severity" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_ITEMS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  name="priority"
                  defaultValue="medium"
                  items={PRIORITY_ITEMS}
                >
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_ITEMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="attachments">Attachments (photos / evidence)</Label>
              <Input
                id="attachments"
                name="attachments"
                type="file"
                accept="image/*"
                multiple
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending || !projectId}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Raise NCR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
