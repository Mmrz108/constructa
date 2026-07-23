import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { CreateChecklistDialog } from "@/components/checklists/create-checklist-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getChecklistTemplates } from "@/lib/queries"
import { ListChecks, Check } from "lucide-react"

export default async function ChecklistsPage() {
  const { orgId } = await requireContext()
  const templates = await getChecklistTemplates(orgId)

  const active = templates.filter((t) => t.isActive)

  return (
    <>
      <PageHeader
        title="Checklist Templates"
        description="Reusable, versioned inspection checklists."
        action={<CreateChecklistDialog />}
      />
      <PageBody>
        {active.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No checklist templates"
            description="Create a reusable checklist template to standardize inspections across your projects."
            action={<CreateChecklistDialog />}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((t) => {
              const items = Array.isArray(t.items)
                ? (t.items as string[])
                : []
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
                    {items.slice(0, 6).map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        <span className="text-pretty">{item}</span>
                      </li>
                    ))}
                    {items.length > 6 && (
                      <li className="pl-5 text-xs text-muted-foreground">
                        +{items.length - 6} more
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
