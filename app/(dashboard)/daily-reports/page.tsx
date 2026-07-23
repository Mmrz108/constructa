import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateDailyReportDialog } from "@/components/daily-reports/create-daily-report-dialog"
import { SubmitReportButton } from "@/components/daily-reports/submit-report-button"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import {
  getDailyReports,
  getProjects,
  getChecklistTemplates,
} from "@/lib/queries"
import { FileText, Cloud, Users, PenLine } from "lucide-react"

export default async function DailyReportsPage() {
  const { orgId } = await requireContext()
  const [reports, projects, templates] = await Promise.all([
    getDailyReports(orgId),
    getProjects(orgId),
    getChecklistTemplates(orgId),
  ])
  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))
  const stageOptions = templates
    .filter((t) => t.isActive)
    .map((t) => ({
      id: t.id,
      name: t.name,
      projectId: t.projectId,
    }))

  return (
    <>
      <PageHeader
        title="Daily Reports"
        description="Site diary with weather, manpower, work done, tomorrow plan, equipment, risks, incidents, photos, and supervisor signature."
        action={
          <CreateDailyReportDialog
            projects={projectOptions}
            stages={stageOptions}
          />
        }
      />
      <PageBody>
        {reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No daily reports"
            description="Create a daily site report to log manpower, weather, and work completed."
            action={
              <CreateDailyReportDialog
                projects={projectOptions}
                stages={stageOptions}
              />
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((r) => {
              const photos = Array.isArray(r.photoUrls) ? r.photoUrls.length : 0
              return (
                <Card key={r.id} className="gap-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-sm font-semibold tabular-nums">
                          {r.reportDate}
                        </h3>
                        <StatusBadge value={r.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {r.projectName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {r.weather && (
                          <span className="flex items-center gap-1.5">
                            <Cloud className="h-3.5 w-3.5" />
                            {r.weather}
                          </span>
                        )}
                        {r.manpower != null && (
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {r.manpower}
                          </span>
                        )}
                        {r.supervisorSignature && (
                          <span className="flex items-center gap-1.5">
                            <PenLine className="h-3.5 w-3.5" />
                            {r.supervisorSignature}
                          </span>
                        )}
                      </div>
                      <SubmitReportButton id={r.id} status={r.status} />
                    </div>
                  </div>
                  {r.workDone && (
                    <p className="text-sm text-pretty">
                      <span className="text-muted-foreground">Work: </span>
                      {r.workDone}
                    </p>
                  )}
                  {r.tomorrowPlan && (
                    <p className="text-sm text-pretty text-muted-foreground">
                      Tomorrow: {r.tomorrowPlan}
                    </p>
                  )}
                  {(r.problemsRisks || r.incidents) && (
                    <p className="text-sm text-pretty text-muted-foreground">
                      {r.problemsRisks
                        ? `Risks: ${r.problemsRisks}`
                        : null}
                      {r.problemsRisks && r.incidents ? " · " : null}
                      {r.incidents ? `Incidents: ${r.incidents}` : null}
                    </p>
                  )}
                  {photos > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {photos} daily photo{photos === 1 ? "" : "s"}
                    </p>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </PageBody>
    </>
  )
}
