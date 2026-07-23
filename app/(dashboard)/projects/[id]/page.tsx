import { PageBody, PageHeader } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getProject } from "@/lib/queries"
import { db } from "@/lib/db"
import { inspection, ncr, defect } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Building2, MapPin, CalendarDays, ArrowLeft } from "lucide-react"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)
  const { orgId } = await requireContext()

  const p = await getProject(orgId, projectId)
  if (!p) notFound()

  const [inspections, ncrs, defects] = await Promise.all([
    db
      .select()
      .from(inspection)
      .where(
        and(eq(inspection.orgId, orgId), eq(inspection.projectId, projectId)),
      )
      .orderBy(desc(inspection.createdAt)),
    db
      .select()
      .from(ncr)
      .where(and(eq(ncr.orgId, orgId), eq(ncr.projectId, projectId)))
      .orderBy(desc(ncr.createdAt)),
    db
      .select()
      .from(defect)
      .where(and(eq(defect.orgId, orgId), eq(defect.projectId, projectId)))
      .orderBy(desc(defect.createdAt)),
  ])

  return (
    <>
      <PageHeader
        title={p.name}
        description={p.code ? `Project ${p.code}` : "Project overview"}
        action={<StatusBadge value={p.status} />}
      />
      <PageBody className="flex flex-col gap-6">
        <Link
          href="/projects"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="gap-1 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> Client
            </span>
            <p className="text-sm font-medium">{p.client ?? "—"}</p>
          </Card>
          <Card className="gap-1 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Location
            </span>
            <p className="text-sm font-medium">{p.location ?? "—"}</p>
          </Card>
          <Card className="gap-1 p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Created
            </span>
            <p className="text-sm font-medium">
              {p.createdAt?.toLocaleDateString()}
            </p>
          </Card>
        </div>

        {p.description && (
          <Card className="gap-1 p-4">
            <span className="text-xs text-muted-foreground">Description</span>
            <p className="text-sm">{p.description}</p>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <MiniList
            title="Inspections"
            href="/inspections"
            items={inspections.map((i) => ({
              id: i.id,
              label: i.title,
              status: i.status,
              href: `/inspections/${i.id}`,
            }))}
          />
          <MiniList
            title="NCRs"
            href="/ncrs"
            items={ncrs.map((n) => ({
              id: n.id,
              label: `${n.number ? n.number + " · " : ""}${n.title}`,
              status: n.severity,
            }))}
          />
          <MiniList
            title="Defects"
            href="/defects"
            items={defects.map((d) => ({
              id: d.id,
              label: d.title,
              status: d.status,
            }))}
          />
        </div>
      </PageBody>
    </>
  )
}

function MiniList({
  title,
  href,
  items,
}: {
  title: string
  href: string
  items: { id: number; label: string; status: string; href?: string }[]
}) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link
          href={href}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y">
        {items.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            None recorded.
          </li>
        )}
        {items.slice(0, 6).map((item) => {
          const content = (
            <div className="flex items-center justify-between gap-2 px-4 py-2.5">
              <span className="truncate text-sm">{item.label}</span>
              <StatusBadge value={item.status} />
            </div>
          )
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="block hover:bg-accent/50">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
