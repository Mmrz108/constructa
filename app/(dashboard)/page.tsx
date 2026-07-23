import { PageBody, PageHeader } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import {
  getDashboardStats,
  getInspections,
  getNcrs,
} from "@/lib/queries"
import Link from "next/link"
import {
  FolderKanban,
  ClipboardCheck,
  AlertTriangle,
  Bug,
  ArrowUpRight,
} from "lucide-react"

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  href: string
  icon: typeof FolderKanban
  accent: string
}) {
  return (
    <Link href={href}>
      <Card className="group gap-0 p-4 transition-colors hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-md ${accent}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </Card>
    </Link>
  )
}

export default async function DashboardPage() {
  const { orgId, user } = await requireContext()
  const [stats, inspections, ncrs] = await Promise.all([
    getDashboardStats(orgId),
    getInspections(orgId),
    getNcrs(orgId),
  ])

  const recentInspections = inspections.slice(0, 5)
  const recentNcrs = ncrs.slice(0, 5)

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Live overview of supervision activity across your projects."
      />
      <PageBody className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Active projects"
            value={stats.projects}
            href="/projects"
            icon={FolderKanban}
            accent="bg-primary/15 text-primary"
          />
          <StatCard
            label="Inspections in review"
            value={stats.openInspections}
            href="/inspections"
            icon={ClipboardCheck}
            accent="bg-chart-4/15 text-chart-4"
          />
          <StatCard
            label="Open NCRs"
            value={stats.openNcrs}
            href="/ncrs"
            icon={AlertTriangle}
            accent="bg-warning/20 text-warning-foreground"
          />
          <StatCard
            label="Open defects"
            value={stats.openDefects}
            href="/defects"
            icon={Bug}
            accent="bg-destructive/15 text-destructive"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Recent inspections</h3>
              <Link
                href="/inspections"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y">
              {recentInspections.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">
                  No inspections yet.
                </li>
              )}
              {recentInspections.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/inspections/${i.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{i.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {i.projectName} · {i.location ?? "No location"}
                      </p>
                    </div>
                    <StatusBadge value={i.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Open non-conformances</h3>
              <Link
                href="/ncrs"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y">
              {recentNcrs.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">
                  No NCRs yet.
                </li>
              )}
              {recentNcrs.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {n.number ? `${n.number} · ` : ""}
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {n.projectName}
                    </p>
                  </div>
                  <StatusBadge value={n.severity} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PageBody>
    </>
  )
}
