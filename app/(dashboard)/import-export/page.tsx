import { PageBody, PageHeader } from "@/components/page-shell"
import { ImportPanel } from "@/components/import-export/import-panel"
import { ExportPanel } from "@/components/import-export/export-panel"
import { JobsTable } from "@/components/import-export/jobs-table"
import { listTransferJobs } from "@/app/actions/import-export"
import { requireAdmin } from "@/lib/session"
import { Card } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default async function ImportExportPage() {
  await requireAdmin()
  const jobs = await listTransferJobs(25)

  return (
    <>
      <PageHeader
        title="Import / Export"
        description="Admin-only data migration tools. Import from CSV/Excel with relationship mapping, duplicate detection, and a full row report. Export any entity for backup or client handover. API-based migration hooks are ready for future connectors."
      />
      <PageBody className="flex flex-col gap-6">
        <Card className="flex items-start gap-3 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Security</p>
            <p className="mt-1 text-pretty">
              Only organization admins can access this module. Uploads are
              size/type checked, text is sanitized, attachment columns accept
              only http(s) or <code className="text-xs">/uploads/…</code> paths,
              and every job is audited.
            </p>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <ImportPanel />
          <ExportPanel />
        </div>

        <JobsTable jobs={jobs} />
      </PageBody>
    </>
  )
}
