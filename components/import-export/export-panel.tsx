"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ENTITY_META, TRANSFER_ENTITIES } from "@/lib/import-export/types"
import { exportEntityFile } from "@/app/actions/import-export"
import { Download } from "lucide-react"

const entityItems = TRANSFER_ENTITIES.map((key) => ({
  value: key,
  label: ENTITY_META[key].label,
}))

function downloadBase64(fileName: string, mime: string, base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const blob = new Blob([bytes], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportPanel() {
  const [entity, setEntity] = useState("projects")
  const [format, setFormat] = useState("xlsx")
  const [pending, startTransition] = useTransition()

  function onExport() {
    const fd = new FormData()
    fd.set("entity", entity)
    fd.set("format", format)
    startTransition(async () => {
      const result = await exportEntityFile(fd)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      downloadBase64(result.fileName, result.mime, result.contentBase64)
      toast.success(`Exported ${result.rowCount} row(s)`)
    })
  }

  return (
    <Card className="gap-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold">Export</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Download current organization data anytime for backup or handover.
          Photo and attachment URLs are included as columns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Entity</Label>
          <Select
            value={entity}
            onValueChange={(v) => setEntity(v ?? "projects")}
            items={entityItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {entityItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Format</Label>
          <Select
            value={format}
            onValueChange={(v) => setFormat(v ?? "xlsx")}
            items={[
              { value: "xlsx", label: "Excel (.xlsx)" },
              { value: "csv", label: "CSV (.csv)" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="button"
        onClick={onExport}
        disabled={pending}
        className="w-fit gap-1.5"
      >
        <Download className="h-4 w-4" />
        {pending ? "Preparing…" : "Download export"}
      </Button>
    </Card>
  )
}
