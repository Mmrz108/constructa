import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { LucideIcon } from "lucide-react"
import { Mail, Phone } from "lucide-react"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export type DirectoryPerson = {
  id: number
  name: string
  email: string | null
  phone: string | null
  refCode: string | null
  notes: string | null
}

export function DirectoryPage({
  title,
  description,
  icon: Icon,
  people,
  emptyTitle,
}: {
  title: string
  description: string
  icon: LucideIcon
  people: DirectoryPerson[]
  emptyTitle: string
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        {people.length === 0 ? (
          <EmptyState
            icon={Icon}
            title={emptyTitle}
            description="Records imported from the previous Bonyan portal will appear here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p) => (
              <Card key={p.id} className="gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {initials(p.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    {p.refCode && (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {p.refCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  {p.email && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {p.email}
                    </span>
                  )}
                  {p.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {p.phone}
                    </span>
                  )}
                  {p.notes && (
                    <Badge variant="secondary" className="w-fit font-normal">
                      {p.notes}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  )
}
