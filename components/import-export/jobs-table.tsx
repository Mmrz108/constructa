import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ENTITY_META, type TransferEntity } from "@/lib/import-export/types"

type JobRow = {
  id: number
  direction: string
  entity: string
  fileName: string | null
  status: string
  importedCount: number
  skippedCount: number
  errorCount: number
  createdAt: Date
}

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  return (
    <Card className="gap-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold">Recent transfer jobs</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Audit trail of imports and exports for this organization.
        </p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transfer jobs yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">OK</TableHead>
                <TableHead className="text-right">Skip</TableHead>
                <TableHead className="text-right">Err</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {j.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{j.direction}</TableCell>
                  <TableCell>
                    {ENTITY_META[j.entity as TransferEntity]?.label ?? j.entity}
                  </TableCell>
                  <TableCell className="max-w-[12rem] truncate text-xs">
                    {j.fileName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        j.status === "failed"
                          ? "destructive"
                          : j.status === "partial"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {j.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {j.importedCount}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {j.skippedCount}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {j.errorCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
