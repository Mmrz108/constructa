import { SiteVisitRequestsPage } from "@/components/site-visit-requests-page"
import { requireContext } from "@/lib/session"
import { getSiteVisitRequests } from "@/lib/queries"

export default async function RejectedRequestsPage() {
  const { orgId } = await requireContext()
  const rows = await getSiteVisitRequests(orgId, "rejected")

  return (
    <SiteVisitRequestsPage
      title="Rejected"
      description="Rejected site visit requests."
      status="rejected"
      rows={rows}
    />
  )
}
