import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { AddMemberDialog } from "@/components/team/add-member-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { requireContext } from "@/lib/session"
import { getOrgMembers } from "@/lib/queries"
import { Users } from "lucide-react"

const ROLE_LABELS: Record<string, string> = {
  supervisor: "Supervisor",
  owner: "Owner",
  contractor: "Contractor",
  developer: "Developer",
  inspector: "Inspector",
  manager: "Manager",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default async function TeamPage() {
  const { orgId, orgName } = await requireContext()
  const members = await getOrgMembers(orgId)

  return (
    <>
      <PageHeader
        title="Team"
        description={`People in ${orgName}. Add teammates so they can be assigned as project roles.`}
        action={<AddMemberDialog />}
      />
      <PageBody>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Add teammates to assign them as owner, contractor, supervisor, or developer on your projects."
            action={<AddMemberDialog />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Card key={m.id} className="flex flex-row items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {initials(m.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.email}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {ROLE_LABELS[m.role] ?? m.role}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  )
}
