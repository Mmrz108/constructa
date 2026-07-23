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
  UserRound,
  HardHat,
  Building2,
  Mail,
  Crown,
  Landmark,
  Shield,
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

/** Menu aligned with legacy login.bonyan-om.com sidebar. */
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
    ],
  },
  {
    label: "User Access",
    items: [
      {
        title: "User Access",
        href: "/user-access",
        icon: Shield,
        ready: true,
      },
      { title: "Client", href: "/clients", icon: UserRound, ready: true },
      {
        title: "Contractor",
        href: "/contractors",
        icon: Building2,
        ready: true,
      },
      {
        title: "Supervisor",
        href: "/supervisors",
        icon: HardHat,
        ready: true,
      },
    ],
  },
  {
    label: "Organization",
    items: [
      { title: "Email", href: "/email", icon: Mail, ready: true },
      { title: "Leaders", href: "/leaders", icon: Crown, ready: true },
      { title: "Accounts", href: "/accounts", icon: Landmark, ready: true },
      { title: "Team", href: "/team", icon: Users, ready: true },
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
]

export const allNavItems = navSections.flatMap((s) => s.items)
