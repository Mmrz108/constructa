"use client"

import { createInspection } from "@/app/actions/inspections"
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
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = { id: number; name: string; code?: string | null }
type StageOption = {
  id: number
  name: string
  projectId: number | null
  discipline: string | null
}

const TYPE_ITEMS = [
  { value: "quality", label: "Quality" },
  { value: "safety", label: "Safety" },
  { value: "progress", label: "Progress" },
]

const PRIORITY_ITEMS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export function CreateInspectionDialog({
  projects,
  stages,
}: {
  projects: ProjectOption[]
  stages: StageOption[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [projectId, setProjectId] = useState("")
  const [stageId, setStageId] = useState("")

  const projectItems = useMemo(
    () =>
      projects.map((p) => ({
        value: String(p.id),
        label: p.code ? `${p.name} (${p.code})` : p.name,
        keywords: p.code ?? undefined,
      })),
    [projects],
  )

  const stagesForProject = useMemo(() => {
    const pid = Number(projectId)
    if (!pid) return []
    return stages.filter((s) => s.projectId === pid)
  }, [stages, projectId])

  const stageItems = useMemo(
    () =>
      stagesForProject.map((s) => ({
        value: String(s.id),
        label: s.discipline ? `${s.name} · ${s.discipline}` : s.name,
        keywords: s.discipline ?? undefined,
      })),
    [stagesForProject],
  )

  function handleProjectChange(nextId: string) {
    setProjectId(nextId)
    const pid = Number(nextId)
    const matched = stages.filter((s) => s.projectId === pid)
    // Auto-select the newest matching stage form when available
    setStageId(matched.length > 0 ? String(matched[0].id) : "")
  }

  function onSubmit(formData: FormData) {
    if (!projectId) {
      toast.error("Select a project")
      return
    }
    if (!stageId) {
      toast.error(
        stagesForProject.length === 0
          ? "Create a stage form for this project first"
          : "Select a stage form",
      )
      return
    }

    formData.set("projectId", projectId)
    formData.set("stageId", stageId)

    startTransition(async () => {
      try {
        await createInspection(formData)
      } catch (e) {
        if (e instanceof Error && e.message === "NEXT_REDIRECT") return
        toast.error(
          e instanceof Error ? e.message : "Failed to create inspection",
        )
      }
    })
  }

  const disabled = projects.length === 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setProjectId("")
          setStageId("")
        }
      }}
    >
      <DialogTrigger
        render={
          <Button disabled={disabled}>
            <Plus className="h-4 w-4" />
            New inspection
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>New inspection</DialogTitle>
            <DialogDescription>
              Choose the same project you used in Create Stages, then pick its
              stage form. Questions load automatically from that form.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Rebar inspection — Level 3 slab"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Project</Label>
              <SearchableSelect
                options={projectItems}
                value={projectId}
                onChange={handleProjectChange}
                placeholder="Search projects…"
                emptyText="No matching project"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Stage form</Label>
              {!projectId ? (
                <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  Select a project first to see its stage forms.
                </p>
              ) : stagesForProject.length === 0 ? (
                <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  No stage form for this project yet.{" "}
                  <Link
                    href="/stages"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    Create one in Stages
                  </Link>
                  .
                </p>
              ) : (
                <SearchableSelect
                  options={stageItems}
                  value={stageId}
                  onChange={setStageId}
                  placeholder="Search stage forms…"
                  emptyText="No matching stage form"
                />
              )}
              {stagesForProject.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  {stagesForProject.length} stage form
                  {stagesForProject.length === 1 ? "" : "s"} for this project
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="quality" items={TYPE_ITEMS}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_ITEMS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="discipline">Discipline</Label>
                <Input
                  id="discipline"
                  name="discipline"
                  placeholder="Structural"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Block B, L3" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="scheduledFor">Scheduled for</Label>
              <Input
                id="scheduledFor"
                name="scheduledFor"
                type="datetime-local"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={pending || !projectId || !stageId}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create inspection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
