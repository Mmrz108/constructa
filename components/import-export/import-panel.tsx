"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ENTITY_META, TRANSFER_ENTITIES } from "@/lib/import-export/types"
import {
  getImportTemplate,
  importEntityFromFile,
  type ImportActionResult,
} from "@/app/actions/import-export"
import { ImportReportView } from "@/components/import-export/import-report-view"
import { Download, Upload } from "lucide-react"

const entityItems = TRANSFER_ENTITIES.map((key) => ({
  value: key,
  label: ENTITY_META[key].label,
}))

function downloadText(fileName: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function ImportPanel() {
  const [entity, setEntity] = useState<string>("projects")
  const [upsert, setUpsert] = useState("true")
  const [report, setReport] = useState<ImportActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  const meta = ENTITY_META[entity as keyof typeof ENTITY_META]

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("entity", entity)
    fd.set("upsert", upsert)
    startTransition(async () => {
      const result = await importEntityFromFile(fd)
      setReport(result)
      if (result.ok) {
        toast.success(
          `Import finished: ${result.report.imported} new, ${result.report.updated} updated, ${result.report.errors} errors`,
        )
      } else {
        toast.error(result.error)
      }
    })
  }

  function onTemplate() {
    startTransition(async () => {
      try {
        const t = await getImportTemplate(entity)
        downloadText(t.fileName, t.csv, "text/csv;charset=utf-8")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Template failed")
      }
    })
  }

  return (
    <Card className="gap-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold">Import</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Upload CSV or Excel. Relationships are resolved by project code,
          stage name, and user email. Duplicates are detected by natural keys.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Entity</Label>
            <Select
              value={entity}
              onValueChange={(v) => setEntity(v ?? "projects")}
              items={entityItems}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {entityItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {meta && (
              <p className="text-xs text-muted-foreground">{meta.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Duplicate handling</Label>
            <Select
              value={upsert}
              onValueChange={(v) => setUpsert(v ?? "true")}
              items={[
                { value: "true", label: "Update existing (upsert)" },
                { value: "false", label: "Skip duplicates" },
              ]}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Update existing (upsert)</SelectItem>
                <SelectItem value="false">Skip duplicates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="import-file">File (.csv / .xlsx)</Label>
          <Input
            id="import-file"
            name="file"
            type="file"
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            required
          />
        </div>

        {meta && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Expected columns
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed break-all">
              {meta.columns.join(", ")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending} className="gap-1.5">
            <Upload className="h-4 w-4" />
            {pending ? "Importing…" : "Run import"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onTemplate}
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download template
          </Button>
        </div>
      </form>

      {report?.ok && <ImportReportView report={report.report} />}
    </Card>
  )
}
