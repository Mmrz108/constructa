import Image from "next/image"
import Link from "next/link"
import { PageBody } from "@/components/page-shell"
import { Card } from "@/components/ui/card"
import { OverallProgress } from "@/components/dashboard/overall-progress"
import { NcrDonut } from "@/components/dashboard/ncr-donut"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { DashboardProjectSwitcher } from "@/components/dashboard/project-switcher"
import {
  ProjectsOverviewDonut,
  ProjectOverviewStats,
} from "@/components/dashboard/projects-overview"
import { requireContext } from "@/lib/session"
import {
  getDashboardStats,
  getLatestProject,
  getProjects,
  getProject,
  getProgressSeries,
  getNcrBreakdown,
  getOrgMembers,
  getProjectStatusBreakdown,
  getOpenErrorReports,
} from "@/lib/queries"
import { DashboardErrorAlerts } from "@/components/dashboard/error-alerts"
import {
  ClipboardCheck,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  HardHat,
  Building2,
  CalendarClock,
  ArrowRight,
  Landmark,
  UserCheck,
} from "lucide-react"

const STATUS_LABEL: Record<string, string> = {
  active: "Under Construction",
  on_hold: "On Hold",
  completed: "Completed",
  rejected: "Rejected",
  archived: "Archived",
}

function KpiCard({
  label,
  value,
  href,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  href: string
  icon: typeof ClipboardCheck
  accent: string
}) {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        View all <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof MapPin
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`truncate text-sm font-medium ${valueClass ?? ""}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>
}) {
  const { orgId } = await requireContext()
  const params = await searchParams
  const requestedId = Number(params.project)

  const [latest, allProjects, members, projectBreakdown, errorAlerts] =
    await Promise.all([
      getLatestProject(orgId),
      getProjects(orgId),
      getOrgMembers(orgId),
      getProjectStatusBreakdown(orgId),
      getOpenErrorReports(orgId),
    ])

  const selectedFromList =
    Number.isFinite(requestedId) && requestedId > 0
      ? allProjects.find((p) => p.id === requestedId)
      : undefined

  const project =
    selectedFromList ??
    latest ??
    (requestedId ? await getProject(orgId, requestedId) : null)

  const selectedId = project?.id

  const [stats, series, ncrBreakdown] = await Promise.all([
    getDashboardStats(orgId),
    selectedId ? getProgressSeries(orgId, selectedId) : Promise.resolve([]),
    // Org-wide NCR mix so the donut always shows Open / In Review / Closed together
    getNcrBreakdown(orgId),
  ])

  const nameOf = (uid: string | null | undefined) =>
    uid ? (members.find((m) => m.id === uid)?.name ?? null) : null
  const contractorName = project
    ? (nameOf(project.contractorUserId) ?? project.contractor)
    : null
  const supervisorName = project ? nameOf(project.supervisorUserId) : null
  const ownerName = project ? nameOf(project.ownerUserId) : null

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const thumbs = allProjects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    imageUrl: p.imageUrl,
  }))

  return (
    <>
      <div className="border-b bg-card px-4 py-5 sm:px-6">
        <h2 className="text-xl font-semibold text-balance">
          Project Dashboard
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{today}</p>
      </div>

      <PageBody className="flex flex-col gap-6">
        <DashboardErrorAlerts items={errorAlerts} />

        <Card className="gap-4 p-4 sm:p-5">
          <div>
            <h3 className="text-base font-semibold">Projects Overview</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Summary of all projects by status
            </p>
          </div>
          <ProjectOverviewStats data={projectBreakdown} />
          <div className="rounded-lg border bg-muted/30 p-4">
            <ProjectsOverviewDonut data={projectBreakdown} />
          </div>
        </Card>

        {thumbs.length > 0 && selectedId && (
          <DashboardProjectSwitcher
            projects={thumbs}
            selectedId={selectedId}
          />
        )}

        {project && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {latest && project.id === latest.id
                ? "Latest updated project"
                : "Selected project"}
            </p>
            <Card className="gap-0 overflow-hidden p-0">
            <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-32 w-full overflow-hidden rounded-lg sm:w-44">
                  <Image
                    src={project.imageUrl || "/images/project-hero.png"}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    {project.code && (
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {project.code}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold text-balance">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location ?? "Location not set"}
                  </div>
                  {project.description && (
                    <p className="max-w-2xl text-sm text-muted-foreground text-pretty">
                      {project.description}
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem
                      icon={HardHat}
                      label="Status"
                      value={STATUS_LABEL[project.status] ?? project.status}
                      valueClass="text-success"
                    />
                    <DetailItem
                      icon={Landmark}
                      label="Owner"
                      value={ownerName ?? "—"}
                    />
                    <DetailItem
                      icon={Building2}
                      label="Contractor"
                      value={contractorName ?? "—"}
                    />
                    <DetailItem
                      icon={UserCheck}
                      label="Supervisor"
                      value={supervisorName ?? "—"}
                    />
                    <DetailItem
                      icon={Building2}
                      label="Consultant"
                      value={project.consultant ?? "—"}
                    />
                    <DetailItem
                      icon={CalendarClock}
                      label="Target Handover"
                      value={
                        project.handoverDate
                          ? new Date(project.handoverDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="lg:border-l lg:pl-6">
                <p className="mb-2 text-sm font-medium">Overall Progress</p>
                <OverallProgress
                  planned={project.progressPlanned}
                  actual={project.progressActual}
                />
              </div>
            </div>
          </Card>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Open Inspections"
            value={stats.openInspections}
            href="/inspections"
            icon={ClipboardCheck}
            accent="bg-chart-4/15 text-chart-4"
          />
          <KpiCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            href="/inspections"
            icon={FileCheck2}
            accent="bg-warning/20 text-warning-foreground"
          />
          <KpiCard
            label="Open NCRs"
            value={stats.openNcrs}
            href="/ncrs"
            icon={AlertTriangle}
            accent="bg-destructive/15 text-destructive"
          />
          <KpiCard
            label="Open Defects"
            value={stats.openDefects}
            href="/defects"
            icon={ShieldCheck}
            accent="bg-success/15 text-success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Construction Progress</h3>
              <span className="text-xs text-muted-foreground">
                {project?.code ?? "Weekly"}
              </span>
            </div>
            <div className="p-4">
              <ProgressChart data={series} />
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">NCR Status</h3>
              <Link
                href="/ncrs"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <div className="flex items-center justify-center p-6">
              <NcrDonut data={ncrBreakdown} />
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  )
}
