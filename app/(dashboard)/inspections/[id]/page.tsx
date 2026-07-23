import { PageBody, PageHeader } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { InspectionChecklist } from "@/components/inspections/inspection-checklist"
import { WorkflowActions } from "@/components/inspections/workflow-actions"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getInspection } from "@/lib/queries"
import { db } from "@/lib/db"
import { inspectionItem } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const workflowSteps = [
  { key: "draft", label: "Draft" },
  { key: "in_review", label: "In Review" },
  { key: "approved", label: "Approved" },
]

export default async function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const inspectionId = Number(id)
  const { orgId } = await requireContext()

  const record = await getInspection(orgId, inspectionId)
  if (!record) notFound()
  const insp = record.inspection

  const items = await db
    .select()
    .from(inspectionItem)
    .where(eq(inspectionItem.inspectionId, inspectionId))
    .orderBy(asc(inspectionItem.sortOrder))

  const editable = insp.status === "draft" || insp.status === "rejected"

  const passed = items.filter((i) => i.result === "pass").length
  const failed = items.filter((i) => i.result === "fail").length
  const na = items.filter((i) => i.result === "na").length
  const pending = items.filter((i) => i.result === "pending").length

  const currentStepIndex =
    insp.status === "rejected"
      ? 1
      : workflowSteps.findIndex((s) => s.key === insp.status)

  return (
    <>
      <PageHeader
        title={insp.title}
        description={`${record.projectName} · ${insp.discipline ?? "General"}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge value={insp.status} />
            <WorkflowActions inspectionId={inspectionId} status={insp.status} />
          </div>
        }
      />
      <PageBody className="flex flex-col gap-6">
        <Link
          href="/inspections"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All inspections
        </Link>

        {/* Workflow tracker */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            {workflowSteps.map((step, idx) => {
              const done = idx < currentStepIndex
              const active = idx === currentStepIndex
              const rejected = insp.status === "rejected" && step.key === "in_review"
              return (
                <div key={step.key} className="flex flex-1 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs ${
                        rejected
                          ? "bg-destructive text-destructive-foreground"
                          : done
                            ? "bg-success text-success-foreground"
                            : active
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`text-sm ${active || done ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {rejected ? "Rejected" : step.label}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div
                      className={`h-px flex-1 ${done ? "bg-success" : "bg-border"}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Checklist */}
          <Card className="p-0 lg:col-span-2">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Checklist</h3>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-success">{passed} pass</span>
                <span className="text-destructive">{failed} fail</span>
                <span className="text-muted-foreground">{na} n/a</span>
                <span className="text-muted-foreground">{pending} pending</span>
              </div>
            </div>
            <InspectionChecklist
              inspectionId={inspectionId}
              items={items}
              editable={editable}
            />
          </Card>

          {/* Meta */}
          <div className="flex flex-col gap-4">
            <Card className="gap-3 p-4">
              <h3 className="text-sm font-semibold">Details</h3>
              <dl className="flex flex-col gap-2.5 text-sm">
                <MetaRow label="Type" value={insp.type} />
                <MetaRow label="Priority">
                  <StatusBadge value={insp.priority} />
                </MetaRow>
                <MetaRow label="Location" value={insp.location ?? "—"} />
                <MetaRow
                  label="Scheduled"
                  value={
                    insp.scheduledFor
                      ? insp.scheduledFor.toLocaleString()
                      : "Not scheduled"
                  }
                />
                <MetaRow
                  label="Created"
                  value={insp.createdAt?.toLocaleDateString() ?? "—"}
                />
              </dl>
            </Card>
            {insp.notes && (
              <Card className="gap-2 p-4">
                <h3 className="text-sm font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground">{insp.notes}</p>
              </Card>
            )}
          </div>
        </div>
      </PageBody>
    </>
  )
}

function MetaRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium capitalize">
        {children ?? value}
      </dd>
    </div>
  )
}
