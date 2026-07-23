import { PageBody, PageHeader } from "@/components/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { requireContext } from "@/lib/session"
import { getDirectoryContacts } from "@/lib/queries"
import Link from "next/link"
import {
  Building2,
  HardHat,
  UserRound,
  Shield,
  Mail,
  ArrowRight,
} from "lucide-react"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default async function UserAccessPage() {
  const { orgId } = await requireContext()
  const [clients, contractors, supervisors] = await Promise.all([
    getDirectoryContacts(orgId, "client"),
    getDirectoryContacts(orgId, "contractor"),
    getDirectoryContacts(orgId, "supervisor"),
  ])

  const groups = [
    {
      key: "client",
      title: "Client",
      href: "/clients",
      icon: UserRound,
      people: clients,
      description: "Project owners and clients with portal access.",
    },
    {
      key: "contractor",
      title: "Contractor",
      href: "/contractors",
      icon: Building2,
      people: contractors,
      description: "Contracting companies assigned to projects.",
    },
    {
      key: "supervisor",
      title: "Supervisor",
      href: "/supervisors",
      icon: HardHat,
      people: supervisors,
      description: "Site supervisors who perform inspections and visits.",
    },
  ]

  return (
    <>
      <PageHeader
        title="User Access"
        description="Manage who can access the portal — Clients, Contractors, and Supervisors (same as the previous Bonyan site)."
      />
      <PageBody className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {groups.map((g) => (
            <Link key={g.key} href={g.href}>
              <Card className="h-full gap-2 p-4 transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <g.icon className="h-5 w-5" />
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {g.people.length}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold">{g.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {g.description}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  View all <ArrowRight className="h-3 w-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        {groups.map((g) => (
          <section key={`list-${g.key}`} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {g.title}
              </h3>
              <Link
                href={g.href}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Open {g.title}
              </Link>
            </div>
            {g.people.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground">
                No {g.title.toLowerCase()} records yet.
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.people.slice(0, 6).map((p) => (
                  <Card
                    key={p.id}
                    className="flex flex-row items-center gap-3 p-3"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {initials(p.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      {p.email && (
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          {p.email}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ))}
      </PageBody>
    </>
  )
}
