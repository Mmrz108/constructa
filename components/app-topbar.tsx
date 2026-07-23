"use client"

import { allNavItems, getNavSectionsForRole } from "@/lib/nav"
import type { PermissionMatrix } from "@/lib/settings/types"
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
import { LanguageSwitcher } from "@/components/language-switcher"
import { AvatarUploadButton } from "@/components/avatar-upload-button"
import { useLocale } from "@/components/locale-provider"
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
  permissions,
}: {
  user: SessionUser
  role: string
  orgName?: string
  permissions?: PermissionMatrix
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { navTitle, navSection, t } = useLocale()
  const sections = getNavSectionsForRole(role, permissions)
  const currentItem =
    allNavItems.find(
      (i) =>
        (i.href === "/" && pathname === "/") ||
        (i.href !== "/" && pathname.startsWith(i.href)),
    )?.title ?? "Dashboard"
  const current = navTitle(currentItem)

  const avatarSrc = user.image || undefined

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
            {sections.map((section) => (
              <DropdownMenuGroup key={section.label}>
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {navSection(section.label)}
                </DropdownMenuLabel>
                {section.items.map((item) => (
                  <DropdownMenuItem
                    key={`${section.label}-${item.href}-${item.title}`}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {navTitle(item.title)}
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

        <div className="mx-1 hidden h-6 w-px bg-border md:hidden" />
        <h1 className="truncate text-sm font-semibold">{current}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <span className="hidden rounded-full border bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
          {role}
        </span>

        {/* Logged-in user photo — top right */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex min-w-0 items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-accent sm:rounded-md sm:px-1.5 sm:py-1"
                title={user.name}
              >
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[9rem] truncate text-sm font-semibold leading-tight">
                    {user.name}
                  </span>
                  <span className="block max-w-[9rem] truncate text-[11px] text-muted-foreground">
                    {orgName ?? user.email}
                  </span>
                </span>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt={user.name} />
                  ) : null}
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{user.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="px-1 py-0.5">
                <AvatarUploadButton />
              </div>
              <DropdownMenuItem
                render={<Link href="/settings">{t("nav.settings")}</Link>}
              />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SignOutButton />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
