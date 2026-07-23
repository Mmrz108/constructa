import { DirectoryPage } from "@/components/directory-page"
import { requireContext } from "@/lib/session"
import { getDirectoryContacts } from "@/lib/queries"
import { UserRound } from "lucide-react"

export default async function ClientsPage() {
  const { orgId } = await requireContext()
  const people = await getDirectoryContacts(orgId, "client")

  return (
    <DirectoryPage
      title="Client"
      description="Clients imported from the previous Bonyan portal."
      icon={UserRound}
      people={people}
      emptyTitle="No clients yet"
    />
  )
}
