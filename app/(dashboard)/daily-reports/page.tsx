import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateDailyReportDialog } from "@/components/daily-reports/create-daily-report-dialog"
import { SubmitReportButton } from "@/components/daily-reports/submit-report-button"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getDailyReports, getProjects } from "@/lib/queries"
import { FileText, Cloud, Users } from "lucide-react"

export default async function DailyReportsPage() {
  const { orgId } = await requireContext()
  const [reports, projects] = await Promise.all([
    getDailyReports(orgId),
    getProjects(orgId),
  ])
  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))

  return (
    <>
      <PageHeader
        title="Daily Reports"
        description="Site diary of daily activity, manpower, and progress."
        action={<CreateDailyReportDialog projects={projectOptions} />}
      />
      <PageBody>
        {reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No daily reports"
            description="Create a daily site report to log manpower, weather, and work completed."
            action={<CreateDailyReportDialog projects={projectOptions} />}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((r) => (
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
                    </div>
                    <SubmitReportButton id={r.id} status={r.status} />
                  </div>
                </div>
                {r.summary && (
                  <p className="text-sm text-muted-foreground text-pretty">
                    {r.summary}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  )
}
