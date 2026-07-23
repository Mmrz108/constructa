import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { CreateChecklistDialog } from "@/components/checklists/create-checklist-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getChecklistTemplates, getProjects, getOrgMembers } from "@/lib/queries"
import { normalizeStageQuestions } from "@/lib/stage-form"
import { ListChecks, Check } from "lucide-react"

export default async function ChecklistsPage() {
  const { orgId } = await requireContext()
  const [templates, projects, members] = await Promise.all([
    getChecklistTemplates(orgId),
    getProjects(orgId),
    getOrgMembers(orgId),
  ])

  const active = templates.filter((t) => t.isActive)
  const supervisors = members.filter(
    (m) => m.role === "supervisor" || m.role === "admin" || m.role === "manager",
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
        title="Checklist Templates"
        description="Project stage forms used by inspections."
        action={dialog}
      />
      <PageBody>
        {active.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No checklist templates"
            description="Create a project-specific stage form with typed questions."
            action={dialog}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((t) => {
              const items = normalizeStageQuestions(t.items)
              return (
                <Card key={t.id} className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold">
                        {t.name}
                      </h3>
                      {t.discipline && (
                        <p className="text-xs text-muted-foreground">
                          {t.discipline}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      v{t.version}
                    </Badge>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {items.slice(0, 8).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        <span className="text-pretty">{item.label}</span>
                      </li>
                    ))}
                    {items.length > 8 && (
                      <li className="pl-5 text-xs text-muted-foreground">
                        +{items.length - 8} more
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
