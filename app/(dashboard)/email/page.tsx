import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getEmailMessages } from "@/lib/queries"
import { Mail } from "lucide-react"

export default async function EmailPage() {
  const { orgId } = await requireContext()
  const messages = await getEmailMessages(orgId)

  return (
    <>
      <PageHeader
        title="Email"
        description="Email system messages for your organization."
      />
      <PageBody>
        {messages.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No emails yet"
            description="Outbound and system emails will appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <Card key={m.id} className="gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.subject}</p>
                    {m.recipient && (
                      <p className="truncate text-xs text-muted-foreground">
                        To: {m.recipient}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {m.status}
                  </Badge>
                </div>
                {m.body && (
                  <p className="text-sm text-muted-foreground text-pretty">
                    {m.body}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  )
}
