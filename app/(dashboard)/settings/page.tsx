import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Organization preferences and portal configuration."
      />
      <PageBody>
        <EmptyState
          icon={Settings}
          title="Settings coming soon"
          description="Workspace branding, notification rules, and role permissions will live here."
        />
      </PageBody>
    </>
  )
}
