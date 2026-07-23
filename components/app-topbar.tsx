"use client"

import { allNavItems, navSections } from "@/lib/nav"
import type { SessionUser } from "@/lib/session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
  orgName,
}: {
  user: SessionUser
  role: string
  orgName?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const current =
    allNavItems.find(
      (i) =>
        (i.href === "/" && pathname === "/") ||
        (i.href !== "/" && pathname.startsWith(i.href)),
    )?.title ?? "Dashboard"

  const avatarSrc = user.image || "/avatars/demo-user.jpg"

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b bg-card px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
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
          <DropdownMenuContent
            align="start"
            className="max-h-[min(70vh,32rem)] w-64 overflow-y-auto"
          >
            {navSections.map((section) => (
              <DropdownMenuGroup key={section.label}>
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </DropdownMenuLabel>
                {section.items.map((item) => (
                  <DropdownMenuItem
                    key={`${section.label}-${item.href}-${item.title}`}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Website logo — left */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md py-1 pr-1 transition-opacity hover:opacity-90 md:hidden"
        >
          <Image
            src="/bonyan-logo.png"
            alt="Bonyan Construction & Engineering Consultancy"
            width={72}
            height={66}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Logged-in user photo — left corner */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex min-w-0 items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent">
                <Avatar className="h-9 w-9 ring-2 ring-primary/15">
                  <AvatarImage src={avatarSrc} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block truncate text-sm font-semibold leading-tight">
                    {user.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {orgName ?? user.email}
                  </span>
                </span>
              </button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings">Settings</Link>} />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SignOutButton />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <h1 className="truncate text-sm font-semibold">{current}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full border bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
          {role}
        </span>
      </div>
    </header>
  )
}
