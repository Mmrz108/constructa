import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CreateInspectionDialog } from "@/components/inspections/create-inspection-dialog"
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
import { getInspections, getProjects } from "@/lib/queries"
import { ClipboardCheck } from "lucide-react"
import Link from "next/link"

export default async function InspectionsPage() {
  const { orgId } = await requireContext()
  const [inspections, projects] = await Promise.all([
    getInspections(orgId),
    getProjects(orgId),
  ])

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))

  return (
    <>
      <PageHeader
        title="Inspections"
        description="Request, checklist, and approve site inspections."
        action={<CreateInspectionDialog projects={projectOptions} />}
      />
      <PageBody>
        {inspections.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No inspections yet"
            description="Create an inspection request to start the checklist and approval workflow."
            action={<CreateInspectionDialog projects={projectOptions} />}
          />
        ) : (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Discipline
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((i) => (
                  <TableRow key={i.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link
                        href={`/inspections/${i.id}`}
                        className="block hover:underline"
                      >
                        {i.title}
                        <span className="block text-xs font-normal text-muted-foreground">
                          {i.location ?? "No location"}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {i.projectName}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {i.discipline ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={i.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={i.status} />
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
