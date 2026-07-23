"use client"

import { allNavItems, navSections } from "@/lib/nav"
import type { SessionUser } from "@/lib/session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Menu } from "lucide-react"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AppTopbar({
  user,
  role,
}: {
  user: SessionUser
  role: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const current =
    allNavItems.find(
      (i) =>
        (i.href === "/" && pathname === "/") ||
        (i.href !== "/" && pathname.startsWith(i.href)),
    )?.title ?? "Dashboard"

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b bg-card px-4">
      <div className="flex items-center gap-2">
        {/* Mobile nav */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            {navSections.map((section) => (
              <div key={section.label}>
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </DropdownMenuLabel>
                {section.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-sm font-semibold">{current}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
          {role}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/settings">Settings</Link>} />
            <DropdownMenuSeparator />
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
