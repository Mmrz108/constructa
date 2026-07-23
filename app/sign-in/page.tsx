import { AuthForm } from "@/components/auth-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSessionUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <AuthForm mode="sign-in" />
    </main>
  )
}
