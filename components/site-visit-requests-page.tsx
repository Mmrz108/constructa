import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

export type SiteVisitRow = {
  id: number
  projectName: string | null
  requesterName: string | null
  visitDate: string | null
  visitTime: string | null
  status: string
  createdAt: Date | string | null
}

export function SiteVisitRequestsPage({
  title,
  description,
  status,
  rows,
}: {
  title: string
  description: string
  status: string
  rows: SiteVisitRow[]
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        {rows.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={`No ${status} site visit requests`}
            description="When clients request a site visit, they will show up in Pending, Approved, or Rejected."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Visit Date</th>
                  <th className="px-4 py-3 font-medium">Visit Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3">{r.requesterName ?? "—"}</td>
                    <td className="px-4 py-3">{r.projectName ?? "—"}</td>
                    <td className="px-4 py-3">{r.visitDate ?? "—"}</td>
                    <td className="px-4 py-3">{r.visitTime ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge value={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length === 0 && (
          <Card className="mt-4 hidden p-4 text-sm text-muted-foreground sm:block">
            Columns match the previous portal: ID, User, Project Name, Visit
            Date, Visit Time, Status.
          </Card>
        )}
      </PageBody>
    </>
  )
}
