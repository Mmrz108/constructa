import { SiteVisitRequestsPage } from "@/components/site-visit-requests-page"
import { requireContext } from "@/lib/session"
import { getSiteVisitRequests } from "@/lib/queries"

export default async function ApprovedRequestsPage() {
  const { orgId } = await requireContext()
  const rows = await getSiteVisitRequests(orgId, "approved")

  return (
    <SiteVisitRequestsPage
      title="Approved"
      description="Approved site visit requests."
      status="approved"
      rows={rows}
    />
  )
}
