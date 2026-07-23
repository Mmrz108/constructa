"use client"

import type { TransferReport } from "@/lib/import-export/types"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  imported: "default",
  updated: "secondary",
  skipped: "outline",
  error: "destructive",
}

export function ImportReportView({ report }: { report: TransferReport }) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <div>
        <h4 className="text-sm font-semibold">Import report</h4>
        <p className="text-xs text-muted-foreground">
          {report.fileName ?? report.entity} · {report.totalRows} rows ·{" "}
          {new Date(report.finishedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Imported" value={report.imported} />
        <Stat label="Updated" value={report.updated} />
        <Stat label="Skipped" value={report.skipped} />
        <Stat label="Errors" value={report.errors} />
      </div>

      <div className="max-h-72 overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Row</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.rows.map((r, idx) => (
              <TableRow key={`${r.row}-${idx}`}>
                <TableCell className="font-mono text-xs">{r.row || "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[r.status] ?? "outline"}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[10rem] truncate text-xs">
                  {r.key ?? "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
