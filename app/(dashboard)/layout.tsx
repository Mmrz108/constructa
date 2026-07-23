import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { AppProviders } from "@/components/app-providers"
import { Toaster } from "@/components/ui/sonner"
import { requireContext } from "@/lib/session"
import { getOrgSettingsPublic } from "@/lib/settings"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await requireContext()
  const settings = await getOrgSettingsPublic(ctx.orgId)

  return (
    <AppProviders settings={settings}>
      <div className="flex h-svh overflow-hidden bg-background">
        <AppSidebar
          orgName={ctx.orgName}
          role={ctx.role}
          permissions={settings.permissions}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar
            user={ctx.user}
            role={ctx.role}
            orgName={ctx.orgName}
            permissions={settings.permissions}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Toaster />
      </div>
    </AppProviders>
  )
}
