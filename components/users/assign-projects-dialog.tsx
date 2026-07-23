"use client"

import { setUserProjectAssignments } from "@/app/actions/members"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_OPTIONS, normalizeRole } from "@/lib/roles"
import { FolderKanban, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = { id: number; name: string }

export function AssignProjectsDialog({
  userId,
  userName,
  currentRole,
  assignedProjectIds,
  projects,
}: {
  userId: string
  userName: string
  currentRole: string
  assignedProjectIds: number[]
  projects: ProjectOption[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [role, setRole] = useState(normalizeRole(currentRole))
  const [selected, setSelected] = useState<number[]>(assignedProjectIds)

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setRole(normalizeRole(currentRole))
      setSelected(assignedProjectIds)
    }
  }

  function onSave() {
    const fd = new FormData()
    fd.set("role", role)
    for (const id of selected) fd.append("projectId", String(id))

    startTransition(async () => {
      try {
        await setUserProjectAssignments(userId, fd)
        toast.success("Project access updated")
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <FolderKanban className="h-3.5 w-3.5" />
            Projects
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign projects — {userName}</DialogTitle>
          <DialogDescription>
            Grant access to one or more projects with a role. Access is enforced
            per project + role.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Role on assigned projects</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(normalizeRole(v ?? "supervisor"))}
              items={ROLE_OPTIONS}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Projects</Label>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              )}
              {projects.map((p) => {
                const checked = selected.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border"
                      checked={checked}
                      onChange={() => {
                        setSelected((prev) =>
                          checked
                            ? prev.filter((id) => id !== p.id)
                            : [...prev, p.id],
                        )
                      }}
                    />
                    {p.name}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={onSave} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
