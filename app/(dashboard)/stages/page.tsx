import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { CreateChecklistDialog } from "@/components/checklists/create-checklist-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import {
  getChecklistTemplates,
  getProjects,
  getOrgMembers,
} from "@/lib/queries"
import { normalizeStageQuestions } from "@/lib/stage-form"
import { ListChecks, Check, Camera } from "lucide-react"

export default async function StagesPage() {
  const { orgId } = await requireContext()
  const [templates, projects, members] = await Promise.all([
    getChecklistTemplates(orgId),
    getProjects(orgId),
    getOrgMembers(orgId),
  ])
  const active = templates.filter((t) => t.isActive)
  const projectName = (id: number | null) =>
    id ? (projects.find((p) => p.id === id)?.name ?? `Project #${id}`) : null
  const memberName = (id: string | null | undefined) =>
    id ? (members.find((m) => m.id === id)?.name ?? null) : null

  const supervisors = members.filter(
    (m) =>
      m.role === "supervisor" || m.role === "admin" || m.role === "manager",
  )
  const supervisorOptions = (
    supervisors.length > 0 ? supervisors : members
  ).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
  }))

  const projectOptions = projects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    supervisorUserId: p.supervisorUserId,
  }))

  const dialog = (
    <CreateChecklistDialog
      projects={projectOptions}
      supervisors={supervisorOptions}
    />
  )

  return (
    <>
      <PageHeader
        title="Create Stages"
        description="Design project-specific inspection forms. Supervisors answer these questions in Inspections."
        action={dialog}
      />
      <PageBody>
        {active.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No stage forms yet"
            description="Create a form for a project with text, multiple-choice, checkbox, pass/fail, or photo questions."
            action={dialog}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((t) => {
              const items = normalizeStageQuestions(t.items)
              const supervisor = memberName(t.supervisorUserId)
              return (
                <Card key={t.id} className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold">
                        {t.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {projectName(t.projectId) ?? "All projects"}
                        {supervisor ? ` · ${supervisor}` : ""}
                        {t.discipline ? ` · ${t.discipline}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px]"
                      >
                        v{t.version}
                      </Badge>
                      <CreateChecklistDialog
                        projects={projectOptions}
                        supervisors={supervisorOptions}
                        initial={{
                          id: t.id,
                          name: t.name,
                          projectId: t.projectId,
                          supervisorUserId: t.supervisorUserId,
                          discipline: t.discipline,
                          items: t.items,
                        }}
                      />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {items.slice(0, 8).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        {item.requirePhoto ? (
                          <Camera className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-4" />
                        ) : (
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        )}
                        <span className="text-pretty">
                          {item.label}
                          <span className="ml-1 text-[10px] uppercase tracking-wide opacity-70">
                            {item.type.replace("_", " ")}
                          </span>
                        </span>
                      </li>
                    ))}
                    {items.length > 8 && (
                      <li className="pl-5 text-xs text-muted-foreground">
                        +{items.length - 8} more
                      </li>
                    )}
                    {items.length === 0 && (
                      <li className="text-xs text-muted-foreground">
                        No questions yet.
                      </li>
                    )}
                  </ul>
                </Card>
              )
            })}
          </div>
        )}
      </PageBody>
    </>
  )
}
