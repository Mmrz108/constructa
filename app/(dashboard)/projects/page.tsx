import Image from "next/image"
import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getProjects, getOrgMembers } from "@/lib/queries"
import { FolderKanban, MapPin, Building2 } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const { orgId } = await requireContext()
  const [projects, members] = await Promise.all([
    getProjects(orgId),
    getOrgMembers(orgId),
  ])

  return (
    <>
      <PageHeader
        title="Project"
        description="All construction projects — imported from the previous Bonyan portal."
        action={<CreateProjectDialog members={members} />}
      />
      <PageBody>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start managing inspections, NCRs, and site records."
            action={<CreateProjectDialog members={members} />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <Card className="h-full gap-0 overflow-hidden p-0 transition-colors hover:border-primary/40">
                  <div className="relative aspect-[16/9] w-full bg-muted">
                    <Image
                      src={p.imageUrl || "/images/project-hero.png"}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {p.code && (
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {p.code}
                        </p>
                      )}
                      <h3 className="truncate text-base font-semibold">
                        {p.name}
                      </h3>
                    </div>
                    <StatusBadge value={p.status} />
                  </div>
                  {p.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-auto flex flex-col gap-1.5 pt-1 text-xs text-muted-foreground">
                    {p.client && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {p.client}
                      </span>
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.location}
                      </span>
                    )}
                    <div className="mt-1">
                      <div className="mb-1 flex justify-between font-mono text-[10px]">
                        <span>Progress</span>
                        <span>
                          {p.progressActual ?? 0}% / {p.progressPlanned ?? 0}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(p.progressActual ?? 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  )
}
