import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { Toaster } from "@/components/ui/sonner"
import { requireContext } from "@/lib/session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await requireContext()

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <AppSidebar orgName={ctx.orgName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={ctx.user} role={ctx.role} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
