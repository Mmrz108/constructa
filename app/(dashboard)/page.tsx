import Image from "next/image"
import Link from "next/link"
import { PageBody } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OverallProgress } from "@/components/dashboard/overall-progress"
import { NcrDonut } from "@/components/dashboard/ncr-donut"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { requireContext } from "@/lib/session"
import {
  getDashboardStats,
  getPrimaryProject,
  getProgressSeries,
  getNcrBreakdown,
  getPendingInspections,
  getInspections,
  getNcrs,
  getDefects,
  getOrgMembers,
} from "@/lib/queries"
import {
  ClipboardCheck,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  HardHat,
  Building2,
  CalendarClock,
  FilePlus2,
  ArrowRight,
  Landmark,
  UserCheck,
} from "lucide-react"

const STATUS_LABEL: Record<string, string> = {
  active: "Under Construction",
  on_hold: "On Hold",
  completed: "Completed",
  archived: "Archived",
}

function timeAgo(date: Date | null) {
  if (!date) return ""
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${Math.max(mins, 1)} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
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

const SITE_PHOTOS = [
  {
    src: "/images/site-structural.png",
    title: "Level 12 — Structural Works",
    caption: "Slab reinforcement and formwork",
  },
  {
    src: "/images/site-facade.png",
    title: "Facade Installation",
    caption: "Curtain wall glazing, north elevation",
  },
  {
    src: "/images/site-mep.png",
    title: "MEP Works — Level 10",
    caption: "Overhead services rough-in",
  },
]

export default async function DashboardPage() {
  const { orgId } = await requireContext()
  const project = await getPrimaryProject(orgId)

  const [stats, series, ncrBreakdown, pending, inspections, ncrs, defects, members] =
    await Promise.all([
      getDashboardStats(orgId),
      project ? getProgressSeries(orgId, project.id) : Promise.resolve([]),
      getNcrBreakdown(orgId),
      getPendingInspections(orgId),
      getInspections(orgId),
      getNcrs(orgId),
      getDefects(orgId),
      getOrgMembers(orgId),
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

  // Recent site activity synthesized from the latest real records.
  const activity = [
    ...inspections.map((i) => ({
      id: `insp-${i.id}`,
      text: `${i.title}`,
      meta: `${i.projectName} · Inspection`,
      at: i.createdAt as Date,
    })),
    ...ncrs.map((n) => ({
      id: `ncr-${n.id}`,
      text: `${n.number ? n.number + " — " : ""}${n.title}`,
      meta: `${n.projectName} · NCR raised`,
      at: n.createdAt as Date,
    })),
    ...defects.map((d) => ({
      id: `def-${d.id}`,
      text: d.title,
      meta: `${d.projectName} · Defect logged`,
      at: d.createdAt as Date,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5)

  return (
    <>
      <div className="flex flex-col gap-3 border-b bg-card px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-semibold text-balance">
            Project Dashboard
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{today}</p>
        </div>
        <Button render={<Link href="/daily-reports" />}>
          <FilePlus2 className="h-4 w-4" />
          New Site Report
        </Button>
      </div>

      <PageBody className="flex flex-col gap-6">
        {project && (
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
                  <h3 className="text-lg font-semibold text-balance">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location ?? "Location not set"}
                  </div>
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
                              { day: "numeric", month: "short", year: "numeric" },
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
              <span className="text-xs text-muted-foreground">Weekly</span>
            </div>
            <div className="p-4">
              <ProgressChart data={series} />
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Pending Inspections</h3>
              <Link
                href="/inspections"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y">
              {pending.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">
                  No pending inspections.
                </li>
              )}
              {pending.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/inspections/${i.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{i.title}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {i.discipline && (
                          <span className="rounded bg-muted px-1.5 py-0.5">
                            {i.discipline}
                          </span>
                        )}
                        {i.scheduledFor
                          ? new Date(i.scheduledFor).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short" },
                            )
                          : "Unscheduled"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge value={i.priority} />
                      <StatusBadge value={i.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
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

          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Recent Site Activity</h3>
            </div>
            <ul className="divide-y">
              {activity.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">
                  No activity yet.
                </li>
              )}
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HardHat className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.text}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.meta}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(a.at)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Latest Site Photos</h3>
            </div>
            <div className="grid gap-3 p-4">
              {SITE_PHOTOS.map((p) => (
                <div key={p.src} className="flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={p.src || "/placeholder.svg"}
                      alt={p.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  )
}
