import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardCheck,
  AlertTriangle,
  Bug,
  FileText,
  ListChecks,
  Users,
  Settings,
  ArrowLeftRight,
} from "lucide-react"
import { can, NAV_MODULE_MAP } from "@/lib/settings/permissions"
import type { PermissionMatrix } from "@/lib/settings/types"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Modules not yet built are flagged so the UI can show a "soon" hint. */
  ready: boolean
}

export type NavSection = {
  label: string
  items: NavItem[]
}

/**
 * Core menus preserved: Dashboard, Project, Create Stages, Users,
 * Inspections, NCRs, Defects & Snags, Daily Reports, Settings.
 */
export const navSections: NavSection[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, ready: true },
      { title: "Project", href: "/projects", icon: FolderKanban, ready: true },
      {
        title: "Create Stages",
        href: "/stages",
        icon: ListChecks,
        ready: true,
      },
      { title: "Users", href: "/users", icon: Users, ready: true },
    ],
  },
  {
    label: "Quality & Site",
    items: [
      {
        title: "Inspections",
        href: "/inspections",
        icon: ClipboardCheck,
        ready: true,
      },
      { title: "NCRs", href: "/ncrs", icon: AlertTriangle, ready: true },
      { title: "Defects & Snags", href: "/defects", icon: Bug, ready: true },
      {
        title: "Daily Reports",
        href: "/daily-reports",
        icon: FileText,
        ready: true,
      },
      { title: "Settings", href: "/settings", icon: Settings, ready: true },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Import / Export",
        href: "/import-export",
        icon: ArrowLeftRight,
        ready: true,
      },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)

/** Filter nav by Settings hub permissions. */
export function getNavSectionsForRole(
  role: string,
  permissions?: PermissionMatrix,
): NavSection[] {
  return navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const mod = NAV_MODULE_MAP[item.title]
        if (mod == null) return true
        return can(role, mod, "view", permissions)
      }),
    }))
    .filter((section) => section.items.length > 0)
}
