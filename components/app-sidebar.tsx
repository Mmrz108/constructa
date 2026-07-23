"use client"

import { getNavSectionsForRole } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import type { PermissionMatrix } from "@/lib/settings/types"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function AppSidebar({
  orgName,
  role,
  permissions,
}: {
  orgName: string
  role: string
  permissions?: PermissionMatrix
}) {
  const pathname = usePathname()
  const { navTitle, navSection, t } = useLocale()
  const sections = getNavSectionsForRole(role, permissions)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-[4.25rem] items-center gap-2.5 border-b bg-card px-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/bonyan-logo.png"
            alt="Bonyan Construction & Engineering Consultancy"
            width={120}
            height={110}
            className="h-11 w-auto max-w-[120px] object-contain object-left"
            priority
          />
        </Link>
      </div>
      <div className="border-b px-4 py-2">
        <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t("brand.name")}
        </p>
        <p className="truncate text-xs text-sidebar-foreground">{orgName}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-1.5 px-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {navSection(section.label)}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                const Icon = item.icon
                return (
                  <li key={`${item.href}-${item.title}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{navTitle(item.title)}</span>
                      {!item.ready && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">
                          soon
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
