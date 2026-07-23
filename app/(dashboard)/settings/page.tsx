import { PageBody, PageHeader } from "@/components/page-shell"
import { SettingsHub } from "@/components/settings/settings-hub"
import { requireContext } from "@/lib/session"
import { normalizeRole } from "@/lib/roles"
import {
  getOrgSettingsPublic,
  listAuditLogs,
} from "@/lib/settings"
import { Card } from "@/components/ui/card"
import { Settings2 } from "lucide-react"

export default async function SettingsPage() {
  const ctx = await requireContext()
  const isAdmin = normalizeRole(ctx.role) === "admin"
  const [settings, auditLogs] = await Promise.all([
    getOrgSettingsPublic(ctx.orgId),
    isAdmin ? listAuditLogs(ctx.orgId, 40) : Promise.resolve([]),
  ])

  return (
    <>
      <PageHeader
        title="Settings"
        description="Central configuration hub. Modules read language, company branding, roles, notifications, report templates, AI, and import/export defaults from here."
      />
      <PageBody className="flex flex-col gap-6">
        <Card className="flex items-start gap-3 p-4">
          <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Settings hub</p>
            <p className="mt-1 text-pretty">
              General defaults, company info (PDF), roles & permissions, notifications,
              report templates (EN / EN–AR), AI translation, import/export limits, and
              audit logs — one source of truth for Projects, Users, Inspections, RFI,
              NCR, Defects, VO and IPC.
            </p>
          </div>
        </Card>

        <SettingsHub
          initial={settings}
          isAdmin={isAdmin}
          auditLogs={auditLogs}
        />
      </PageBody>
    </>
  )
}
