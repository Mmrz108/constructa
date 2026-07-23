import { createOrganization } from "@/app/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requireUser } from "@/lib/session"
import { db } from "@/lib/db"
import { membership } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { HardHat } from "lucide-react"

export default async function OnboardingPage() {
  const user = await requireUser()

  // If they already have an org, skip onboarding.
  const existing = await db
    .select({ id: membership.id })
    .from(membership)
    .where(eq(membership.userId, user.id))
    .limit(1)
  if (existing[0]) redirect("/")

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-widest">
              BuildSight
            </p>
            <p className="text-xs text-muted-foreground">Workspace setup</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-balance">
            Set up your organization
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome, {user.name}. Create your company workspace to start
            supervising projects. We&apos;ll seed a sample project so you can
            explore right away.
          </p>

          <form action={createOrganization} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="orgName">Organization / company name</Label>
              <Input
                id="orgName"
                name="orgName"
                placeholder="Acme Contracting Co."
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="projectName">First project name (optional)</Label>
              <Input
                id="projectName"
                name="projectName"
                placeholder="Riverside Tower — Phase 1"
              />
            </div>
            <Button type="submit" className="mt-2">
              Create workspace
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
