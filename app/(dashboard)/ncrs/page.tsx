import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateNcrDialog } from "@/components/ncrs/create-ncr-dialog"
import { NcrStatusMenu } from "@/components/ncrs/ncr-status-menu"
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
import { getNcrs, getProjects } from "@/lib/queries"
import { AlertTriangle } from "lucide-react"

export default async function NcrsPage() {
  const { orgId } = await requireContext()
  const [ncrs, projects] = await Promise.all([
    getNcrs(orgId),
    getProjects(orgId),
  ])
  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))

  const open = ncrs.filter((n) => n.status !== "closed").length

  return (
    <>
      <PageHeader
        title="Non-Conformance Reports"
        description={`${open} open · ${ncrs.length} total. Track corrective-action cycles to closure.`}
        action={<CreateNcrDialog projects={projectOptions} />}
      />
      <PageBody>
        {ncrs.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="No NCRs raised"
            description="Raise a non-conformance report to log a quality or compliance issue for corrective action."
            action={<CreateNcrDialog projects={projectOptions} />}
          />
        ) : (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="hidden lg:table-cell">Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ncrs.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {n.number ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {n.projectName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={n.severity} />
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">
                      {n.dueDate ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={n.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <NcrStatusMenu id={n.id} status={n.status} />
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
