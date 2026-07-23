import { DirectoryPage } from "@/components/directory-page"
import { requireContext } from "@/lib/session"
import { getDirectoryContacts } from "@/lib/queries"
import { Crown } from "lucide-react"

export default async function LeadersPage() {
  const { orgId } = await requireContext()
  const people = await getDirectoryContacts(orgId, "leader")

  return (
    <DirectoryPage
      title="Leaders"
      description="Organization leaders."
      icon={Crown}
      people={people}
      emptyTitle="No leaders yet"
    />
  )
}
