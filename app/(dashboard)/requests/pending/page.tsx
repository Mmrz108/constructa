import { SiteVisitRequestsPage } from "@/components/site-visit-requests-page"
import { requireContext } from "@/lib/session"
import { getSiteVisitRequests } from "@/lib/queries"

export default async function PendingRequestsPage() {
  const { orgId } = await requireContext()
  const rows = await getSiteVisitRequests(orgId, "pending")

  return (
    <SiteVisitRequestsPage
      title="Pending"
      description="Site visit requests waiting for approval."
      status="pending"
      rows={rows}
    />
  )
}
