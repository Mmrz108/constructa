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
import { getDefects, getProjects } from "@/lib/queries"
import { Bug } from "lucide-react"

export default async function DefectsPage() {
  const { orgId } = await requireContext()
  const [defects, projects] = await Promise.all([
    getDefects(orgId),
    getProjects(orgId),
  ])
  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))

  const open = defects.filter((d) => d.status !== "closed").length

  return (
    <>
      <PageHeader
        title="Defects & Snags"
        description={`${open} open · ${defects.length} total. Punch-list items tracked to verification.`}
        action={<CreateDefectDialog projects={projectOptions} />}
      />
      <PageBody>
        {defects.length === 0 ? (
          <EmptyState
            icon={Bug}
            title="No defects logged"
            description="Log a defect or snag observed on site to track it through rectification and verification."
            action={<CreateDefectDialog projects={projectOptions} />}
          />
        ) : (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Trade</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defects.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.title}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {d.projectName}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {d.location ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {d.trade ?? "—"}
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
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </PageBody>
    </>
  )
}
