import { redirect } from "next/navigation"

/** Legacy User Access route → Users module. */
export default function UserAccessRedirect() {
  redirect("/users")
}
