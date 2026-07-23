import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { Card } from "@/components/ui/card"
import { requireContext } from "@/lib/session"
import { getFinanceAccounts } from "@/lib/queries"
import { Landmark } from "lucide-react"

export default async function AccountsPage() {
  const { orgId } = await requireContext()
  const accounts = await getFinanceAccounts(orgId)

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Bank and finance accounts for the organization."
      />
      <PageBody>
        {accounts.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No accounts yet"
            description="Add account type, title, account number, and IBAN."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Account Type</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Account Number</th>
                  <th className="px-4 py-3 font-medium">IBAN</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                    <td className="px-4 py-3">{a.accountType ?? "—"}</td>
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {a.accountNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {a.iban ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {accounts.length === 0 && (
          <Card className="mt-4 hidden p-4 text-sm text-muted-foreground sm:block">
            Columns match the previous portal: Account Type, Title, Account
            Number, IBAN.
          </Card>
        )}
      </PageBody>
    </>
  )
}
