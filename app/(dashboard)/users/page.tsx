import { PageBody, PageHeader, EmptyState } from "@/components/page-shell"
import { AddMemberDialog } from "@/components/team/add-member-dialog"
import { ManageUserDialog } from "@/components/users/manage-user-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireContext } from "@/lib/session"
import {
  getOrgMembers,
  getProjects,
  getProjectMemberships,
} from "@/lib/queries"
import { ROLE_LABELS, normalizeRole, type OrgRole } from "@/lib/roles"
import { getOrgSettings, can } from "@/lib/settings"
import {
  SETTING_MODULES,
  type SettingModule,
} from "@/lib/settings/types"
import { Users } from "lucide-react"

const MODULE_LABELS: Record<SettingModule, string> = {
  projects: "Projects",
  users: "Users",
  stages: "Stages",
  inspections: "Inspections",
  ncrs: "NCRs",
  defects: "Defects & Snags",
  daily_reports: "Daily Reports",
  rfis: "RFI",
  vos: "VO",
  ipcs: "IPC",
  settings: "Settings",
  import_export: "Import / Export",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function roleBadge(role: string) {
  const key = normalizeRole(role)
  const labels = ROLE_LABELS[key as OrgRole]
  return labels ? `${labels.en}` : role
}

function permissionsForRole(
  role: string,
  matrix: Awaited<ReturnType<typeof getOrgSettings>>["permissions"],
) {
  const key = normalizeRole(role) as OrgRole
  const row = matrix[key] ?? {}
  return SETTING_MODULES.map((mod) => {
    const actions = row[mod] ?? []
    if (actions.length === 0) return null
    return {
      module: mod,
      label: MODULE_LABELS[mod],
      actions: [...actions],
    }
  }).filter((x): x is NonNullable<typeof x> => Boolean(x))
}

export default async function UsersPage() {
  const { orgId, role: actorRole, user: actor } = await requireContext()
  const settings = await getOrgSettings(orgId)
  const [members, projects, assignments] = await Promise.all([
    getOrgMembers(orgId),
    getProjects(orgId),
    getProjectMemberships(orgId),
  ])

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }))
  const assignedMap = new Map<string, { id: number; name: string }[]>()
  for (const a of assignments) {
    const list = assignedMap.get(a.userId) ?? []
    if (!list.some((p) => p.id === a.projectId)) {
      list.push({ id: a.projectId, name: a.projectName })
    }
    assignedMap.set(a.userId, list)
  }

  const canCreate = can(actorRole, "users", "create", settings.permissions)
  const canEdit = can(actorRole, "users", "edit", settings.permissions)
  const canDelete = can(actorRole, "users", "delete", settings.permissions)

  return (
    <>
      <PageHeader
        title="Users"
        description="View user details, edit profile and role, change project access, or remove users."
        action={
          canCreate ? <AddMemberDialog projects={projectOptions} /> : undefined
        }
      />
      <PageBody>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users yet"
            description="Add users and assign them to projects with the right role."
            action={
              canCreate ? (
                <AddMemberDialog projects={projectOptions} />
              ) : undefined
            }
          />
        ) : (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Projects
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => {
                  const projectsForUser = assignedMap.get(m.id) ?? []
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {m.image ? (
                              <AvatarImage src={m.image} alt={m.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                              {initials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {m.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {m.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {roleBadge(m.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {projectsForUser.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            No projects
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {projectsForUser.slice(0, 3).map((p) => (
                              <Badge
                                key={p.id}
                                variant="outline"
                                className="font-normal"
                              >
                                {p.name}
                              </Badge>
                            ))}
                            {projectsForUser.length > 3 && (
                              <Badge variant="outline" className="font-normal">
                                +{projectsForUser.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <ManageUserDialog
                          user={m}
                          projects={projectOptions}
                          assignedProjectIds={projectsForUser.map((p) => p.id)}
                          rolePermissions={permissionsForRole(
                            m.role,
                            settings.permissions,
                          )}
                          canEdit={canEdit}
                          canDelete={canDelete}
                          isSelf={m.id === actor.id}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </PageBody>
    </>
  )
}
