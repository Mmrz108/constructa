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

const PRIORITY_ITEMS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export function CreateDefectDialog({
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
        await createDefect(formData)
        toast.success("Defect logged")
        setOpen(false)
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
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Log defect / snag</DialogTitle>
            <DialogDescription>
              Record a defect or snag observed on site for rectification.
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
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium" items={PRIORITY_ITEMS}>
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
                <Label htmlFor="trade">Trade</Label>
                <Input id="trade" name="trade" placeholder="Finishes" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="assignedTo">Assigned to</Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                placeholder="Subcontractor / party"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe the defect..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Log defect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
