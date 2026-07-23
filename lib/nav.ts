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
} from "lucide-react"

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

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, ready: true },
      { title: "Projects", href: "/projects", icon: FolderKanban, ready: true },
    ],
  },
  {
    label: "Quality & Compliance",
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
        title: "Checklists",
        href: "/checklists",
        icon: ListChecks,
        ready: true,
      },
    ],
  },
  {
    label: "Site Records",
    items: [
      {
        title: "Daily Reports",
        href: "/daily-reports",
        icon: FileText,
        ready: true,
      },
      { title: "Team", href: "/team", icon: Users, ready: true },
      { title: "Settings", href: "/settings", icon: Settings, ready: false },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)
