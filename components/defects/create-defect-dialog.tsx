"use client"

import { createDefect } from "@/app/actions/defects"
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

const PRIORITY_ITEMS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export function CreateDefectDialog({
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
        await createDefect(formData)
        toast.success("Defect logged")
        setOpen(false)
        setProjectId("")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to log defect")
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
            Log defect
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <form action={onSubmit} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle>Log defect / snag</DialogTitle>
            <DialogDescription>
              Track execution defects with category, assignee, before/after
              photos. Status flows until close approval.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Cracked floor tile in lobby"
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Finishes / MEP / Structural"
                />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ground floor lobby"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="assignedTo">Responsible for fix</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  placeholder="Subcontractor / party"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="beforePhotos">Before photo(s)</Label>
                <Input
                  id="beforePhotos"
                  name="beforePhotos"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="afterPhotos">After photo(s)</Label>
                <Input
                  id="afterPhotos"
                  name="afterPhotos"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending || !projectId}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Log defect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
