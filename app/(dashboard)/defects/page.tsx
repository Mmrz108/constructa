import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateDefectDialog } from "@/components/defects/create-defect-dialog"
import { DefectStatusMenu } from "@/components/defects/defect-status-menu"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireContext } from "@/lib/session"
import {
  getDefects,
  getProjects,
  getChecklistTemplates,
} from "@/lib/queries"
import { Bug } from "lucide-react"

export default async function DefectsPage() {
  const { orgId } = await requireContext()
  const [defects, projects, templates] = await Promise.all([
    getDefects(orgId),
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

  const open = defects.filter((d) => d.status !== "closed").length

  return (
    <>
      <PageHeader
        title="Defects & Snags"
        description={`${open} open · ${defects.length} total. Before/after photos, category, assignee, close approval. Linked to project & stage.`}
        action={
          <CreateDefectDialog
            projects={projectOptions}
            stages={stageOptions}
          />
        }
      />
      <PageBody>
        {defects.length === 0 ? (
          <EmptyState
            icon={Bug}
            title="No defects logged"
            description="Log a defect or snag observed on site to track it through rectification and verification."
            action={
              <CreateDefectDialog
                projects={projectOptions}
                stages={stageOptions}
              />
            }
          />
        ) : (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defects.map((d) => {
                  const before = Array.isArray(d.beforePhotoUrls)
                    ? d.beforePhotoUrls.length
                    : 0
                  const after = Array.isArray(d.afterPhotoUrls)
                    ? d.afterPhotoUrls.length
                    : 0
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        <div>
                          {d.title}
                          <p className="text-xs font-normal text-muted-foreground">
                            Photos: {before} before · {after} after
                            {d.assignedTo ? ` · ${d.assignedTo}` : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {d.projectName}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {d.category ?? d.trade ?? "—"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {d.location ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={d.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={d.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DefectStatusMenu id={d.id} status={d.status} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </PageBody>
    </>
  )
}
