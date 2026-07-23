import { DirectoryPage } from "@/components/directory-page"
import { requireContext } from "@/lib/session"
import { getDirectoryContacts } from "@/lib/queries"
import { HardHat } from "lucide-react"

export default async function SupervisorsPage() {
  const { orgId } = await requireContext()
  const people = await getDirectoryContacts(orgId, "supervisor")

  return (
    <DirectoryPage
      title="Supervisor"
      description="Supervisors imported from the previous Bonyan portal."
      icon={HardHat}
      people={people}
      emptyTitle="No supervisors yet"
    />
  )
}
