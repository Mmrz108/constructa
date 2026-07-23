import { DirectoryPage } from "@/components/directory-page"
import { requireContext } from "@/lib/session"
import { getDirectoryContacts } from "@/lib/queries"
import { Building2 } from "lucide-react"

export default async function ContractorsPage() {
  const { orgId } = await requireContext()
  const people = await getDirectoryContacts(orgId, "contractor")

  return (
    <DirectoryPage
      title="Contractor"
      description="Contractors imported from the previous Bonyan portal."
      icon={Building2}
      people={people}
      emptyTitle="No contractors yet"
    />
  )
}
