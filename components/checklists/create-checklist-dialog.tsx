"use client"

import {
  createChecklistTemplate,
  updateChecklistTemplate,
} from "@/app/actions/checklists"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import {
  QUESTION_TYPE_LABELS,
  newQuestionId,
  normalizeStageQuestions,
  type QuestionType,
  type StageQuestion,
} from "@/lib/stage-form"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = {
  id: number
  name: string
  code: string | null
  supervisorUserId?: string | null
}

type SupervisorOption = {
  id: string
  name: string
  email?: string | null
}

export type StageFormInitial = {
  id: number
  name: string
  projectId: number | null
  supervisorUserId: string | null
  discipline: string | null
  items: unknown
}

const TYPE_ITEMS = (
  Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]
).map((value) => ({
  value,
  label: QUESTION_TYPE_LABELS[value],
}))

function emptyQuestion(): StageQuestion {
  return {
    id: newQuestionId(),
    label: "",
    type: "pass_fail",
    options: [],
    optionsRaw: "",
    required: true,
    requirePhoto: false,
    allowText: true,
  }
}

function questionsFromItems(items: unknown): StageQuestion[] {
  const normalized = normalizeStageQuestions(items)
  if (normalized.length === 0) return [emptyQuestion()]
  return normalized.map((q) => ({
    ...q,
    optionsRaw: (q.options ?? []).join(", "),
  }))
}

export function CreateChecklistDialog({
  projects,
  supervisors,
  initial,
  trigger,
}: {
  projects: ProjectOption[]
  supervisors: SupervisorOption[]
  initial?: StageFormInitial
  /** Custom trigger; defaults to “New stage form” or “Edit”. */
  trigger?: React.ReactNode
}) {
  const isEdit = Boolean(initial)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState(initial?.name ?? "")
  const [discipline, setDiscipline] = useState(initial?.discipline ?? "")
  const [projectId, setProjectId] = useState(
    initial?.projectId ? String(initial.projectId) : "",
  )
  const [supervisorUserId, setSupervisorUserId] = useState(
    initial?.supervisorUserId ?? "",
  )
  const [questions, setQuestions] = useState<StageQuestion[]>(() =>
    initial ? questionsFromItems(initial.items) : [emptyQuestion()],
  )

  useEffect(() => {
    if (!open || !initial) return
    setName(initial.name)
    setDiscipline(initial.discipline ?? "")
    setProjectId(initial.projectId ? String(initial.projectId) : "")
    setSupervisorUserId(initial.supervisorUserId ?? "")
    setQuestions(questionsFromItems(initial.items))
  }, [open, initial])

  const supervisorNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const s of supervisors) map.set(s.id, s.name)
    return map
  }, [supervisors])

  const projectOptions = useMemo(
    () =>
      projects.map((p) => {
        const supervisorName = p.supervisorUserId
          ? supervisorNameById.get(p.supervisorUserId)
          : undefined
        return {
          value: String(p.id),
          label: p.code ? `${p.name} (${p.code})` : p.name,
          keywords: [p.code, supervisorName, "supervisor"]
            .filter(Boolean)
            .join(" "),
        }
      }),
    [projects, supervisorNameById],
  )

  const supervisorOptions = useMemo(
    () =>
      supervisors.map((s) => ({
        value: s.id,
        label: s.name,
        keywords: s.email ?? undefined,
      })),
    [supervisors],
  )

  function handleProjectChange(nextId: string) {
    setProjectId(nextId)
    const project = projects.find((p) => String(p.id) === nextId)
    if (project?.supervisorUserId) {
      setSupervisorUserId(project.supervisorUserId)
    }
  }

  function updateQuestion(id: string, patch: Partial<StageQuestion>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    )
  }

  function resetForm() {
    if (initial) {
      setName(initial.name)
      setDiscipline(initial.discipline ?? "")
      setProjectId(initial.projectId ? String(initial.projectId) : "")
      setSupervisorUserId(initial.supervisorUserId ?? "")
      setQuestions(questionsFromItems(initial.items))
      return
    }
    setName("")
    setDiscipline("")
    setQuestions([emptyQuestion()])
    setProjectId("")
    setSupervisorUserId("")
  }

  function onSubmit(formData: FormData) {
    const cleaned = questions
      .map((q) => {
        const raw =
          q.optionsRaw ??
          (Array.isArray(q.options) ? q.options.join(", ") : "")
        const options = raw
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
        const { optionsRaw: _raw, ...rest } = q
        return {
          ...rest,
          label: q.label.trim(),
          options,
          requirePhoto: q.requirePhoto || q.type === "photo",
          allowText: q.allowText !== false || q.type === "text",
        }
      })
      .filter((q) => q.label.length > 0)

    if (!name.trim()) {
      toast.error("Stage name is required")
      return
    }
    if (!projectId) {
      toast.error("Select a project")
      return
    }
    if (!supervisorUserId) {
      toast.error("Select a supervisor")
      return
    }
    if (cleaned.length === 0) {
      toast.error("Add at least one question")
      return
    }

    formData.set("name", name.trim())
    formData.set("discipline", discipline.trim())
    formData.set("projectId", projectId)
    formData.set("supervisorUserId", supervisorUserId)
    formData.set("questions", JSON.stringify(cleaned))

    startTransition(async () => {
      try {
        if (isEdit && initial) {
          await updateChecklistTemplate(initial.id, formData)
          toast.success("Stage form updated")
        } else {
          await createChecklistTemplate(formData)
          toast.success("Stage form created")
          resetForm()
        }
        setOpen(false)
      } catch (e) {
        toast.error(
          e instanceof Error
            ? e.message
            : isEdit
              ? "Failed to update stage form"
              : "Failed to create stage form",
        )
      }
    })
  }

  const canSubmit = projects.length > 0 && supervisors.length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DialogTrigger
        render={
          (trigger as React.ReactElement) ??
          (isEdit ? (
            <Button variant="outline" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <Button disabled={!canSubmit}>
              <Plus className="h-4 w-4" />
              New stage form
            </Button>
          ))
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit stage form" : "Create stage form"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the project, supervisor, and questions for this stage."
                : "Search and select a project and supervisor, then design the inspection questions."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`name-${initial?.id ?? "new"}`}>Stage name</Label>
              <Input
                id={`name-${initial?.id ?? "new"}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Foundation inspection"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Project</Label>
                <SearchableSelect
                  options={projectOptions}
                  value={projectId}
                  onChange={handleProjectChange}
                  placeholder="Search projects…"
                  emptyText="No matching project"
                />
                <p className="text-[11px] text-muted-foreground">
                  Search by project name, code, or supervisor
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Supervisor</Label>
                <SearchableSelect
                  options={supervisorOptions}
                  value={supervisorUserId}
                  onChange={setSupervisorUserId}
                  placeholder="Search supervisors…"
                  emptyText="No matching supervisor"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`discipline-${initial?.id ?? "new"}`}>
                Discipline
              </Label>
              <Input
                id={`discipline-${initial?.id ?? "new"}`}
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="Structural"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Questions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQuestions((prev) => [...prev, emptyQuestion()])
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add question
                </Button>
              </div>

              {questions.map((q, idx) => {
                const needsOptions =
                  q.type === "single_choice" || q.type === "multi_choice"
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-2 w-6 shrink-0 font-mono text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <Input
                          value={q.label}
                          onChange={(e) =>
                            updateQuestion(q.id, { label: e.target.value })
                          }
                          placeholder="Question text"
                          required
                        />
                        <Select
                          value={q.type}
                          onValueChange={(v) =>
                            updateQuestion(q.id, {
                              type: (v as QuestionType) || "pass_fail",
                              requirePhoto:
                                v === "photo" ? true : q.requirePhoto,
                              optionsRaw:
                                v === "single_choice" || v === "multi_choice"
                                  ? (q.optionsRaw ??
                                    (q.options ?? []).join(", "))
                                  : q.optionsRaw,
                            })
                          }
                          items={TYPE_ITEMS}
                        >
                          <SelectTrigger className="w-full">
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
                        {needsOptions && (
                          <div className="flex flex-col gap-1.5">
                            <Input
                              value={
                                q.optionsRaw ??
                                (q.options ?? []).join(", ")
                              }
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  optionsRaw: e.target.value,
                                })
                              }
                              placeholder="Good, Fair, Poor"
                            />
                            <p className="text-[11px] text-muted-foreground">
                              Separate options with commas (e.g. Yes, No, N/A)
                            </p>
                          </div>
                        )}
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            className="size-4 rounded border"
                            checked={
                              Boolean(q.requirePhoto) || q.type === "photo"
                            }
                            disabled={q.type === "photo"}
                            onChange={(e) =>
                              updateQuestion(q.id, {
                                requirePhoto: e.target.checked,
                              })
                            }
                          />
                          Require photo with answer
                        </label>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            className="size-4 rounded border"
                            checked={q.allowText !== false || q.type === "text"}
                            disabled={q.type === "text"}
                            onChange={(e) =>
                              updateQuestion(q.id, {
                                allowText: e.target.checked,
                              })
                            }
                          />
                          Answer can include text
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={questions.length <= 1}
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.filter((item) => item.id !== q.id),
                          )
                        }
                        aria-label="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending || !canSubmit}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Save stage form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
