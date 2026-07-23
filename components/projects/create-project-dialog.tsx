"use client"

import { createProject } from "@/app/actions/projects"
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
import { Plus, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type Member = { id: string; name: string; role: string }

const STATUS_ITEMS = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
]

export function CreateProjectDialog({ members }: { members: Member[] }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const noMembers = members.length === 0

  const memberItems = useMemo(
    () => members.map((m) => ({ value: m.id, label: m.name })),
    [members],
  )

  const developerItems = useMemo(
    () => [{ value: "none", label: "None" }, ...memberItems],
    [memberItems],
  )

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createProject(formData)
        toast.success("Project created")
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create project")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Add a new construction project to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" name="name" required placeholder="Riverside Tower" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Project code</Label>
                <Input id="code" name="code" placeholder="PRJ-002" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue="active"
                  items={STATUS_ITEMS}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ITEMS.map((s) => (
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
                <Label htmlFor="client">Client</Label>
                <Input id="client" name="client" placeholder="Acme Developments" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Downtown site" />
              </div>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">Project roles</p>
                <Link
                  href="/users"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <UserPlus className="h-3 w-3" />
                  Manage team
                </Link>
              </div>
              {noMembers ? (
                <p className="text-sm text-muted-foreground text-pretty">
                  Add teammates on the{" "}
                  <Link href="/users" className="text-primary hover:underline">
                    Team page
                  </Link>{" "}
                  first, then assign them here.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="ownerUserId">Owner *</Label>
                    <Select name="ownerUserId" required items={memberItems}>
                      <SelectTrigger id="ownerUserId" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberItems.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contractorUserId">Contractor *</Label>
                    <Select name="contractorUserId" required items={memberItems}>
                      <SelectTrigger id="contractorUserId" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberItems.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="supervisorUserId">Supervisor *</Label>
                    <Select name="supervisorUserId" required items={memberItems}>
                      <SelectTrigger id="supervisorUserId" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberItems.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="developerUserId">Developer</Label>
                    <Select
                      name="developerUserId"
                      defaultValue="none"
                      items={developerItems}
                    >
                      <SelectTrigger id="developerUserId" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {developerItems.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Scope and notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
