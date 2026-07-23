import { redirect } from "next/navigation"

/** Team is merged into Users. */
export default function TeamRedirect() {
  redirect("/users")
}
