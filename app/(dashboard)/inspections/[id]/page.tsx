import { PageBody, PageHeader } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { InspectionChecklist } from "@/components/inspections/inspection-checklist"
import { WorkflowActions } from "@/components/inspections/workflow-actions"
import { ErrorReportButton } from "@/components/inspections/error-report-button"
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

  const answered = items.filter((i) => i.result !== "pending").length
  const failed = items.filter((i) => i.result === "fail").length
  const pendingCount = items.filter((i) => i.result === "pending").length
  const withPhotos = items.filter(
    (i) => Array.isArray(i.photoUrls) && (i.photoUrls as string[]).length > 0,
  ).length

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
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={insp.status} />
            {editable && <ErrorReportButton inspectionId={inspectionId} />}
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

        <Card className="p-4">
          <div className="flex items-center gap-2">
            {workflowSteps.map((step, idx) => {
              const done = idx < currentStepIndex
              const active = idx === currentStepIndex
              const rejected =
                insp.status === "rejected" && step.key === "in_review"
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
          <Card className="p-0 lg:col-span-2">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Inspection form</h3>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-muted-foreground">
                  {answered}/{items.length} answered
                </span>
                <span className="text-destructive">{failed} fail</span>
                <span className="text-muted-foreground">
                  {withPhotos} photo
                </span>
                <span className="text-muted-foreground">
                  {pendingCount} pending
                </span>
              </div>
            </div>
            <InspectionChecklist
              inspectionId={inspectionId}
              items={items.map((i) => ({
                id: i.id,
                label: i.label,
                result: i.result,
                comment: i.comment,
                questionType: i.questionType,
                answer: i.answer,
                photoUrls: i.photoUrls,
                options: i.options,
                requirePhoto: i.requirePhoto,
                allowText: i.allowText,
              }))}
              editable={editable}
            />
          </Card>

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
                <h3 className="text-sm font-semibold">Notes / Error details</h3>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {insp.notes}
                </p>
              </Card>
            )}
            {editable && (
              <Card className="gap-2 border-destructive/30 bg-destructive/5 p-4">
                <h3 className="text-sm font-semibold text-destructive">
                  Error Report
                </h3>
                <p className="text-xs text-muted-foreground">
                  After answering all questions (and uploading required photos),
                  submit an Error Report to flag this project on the dashboard.
                </p>
                <ErrorReportButton inspectionId={inspectionId} />
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
