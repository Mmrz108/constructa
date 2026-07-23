import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <AuthForm mode="sign-up" />
    </main>
  )
}
