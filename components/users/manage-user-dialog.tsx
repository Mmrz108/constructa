"use client"

import {
  removeMember,
  setUserProjectAssignments,
  updateMember,
} from "@/app/actions/members"
import { ManagePhotoDialog } from "@/components/users/manage-photo-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROLE_LABELS, ROLE_OPTIONS, normalizeRole, type OrgRole } from "@/lib/roles"
import {
  Eye,
  Loader2,
  Pencil,
  FolderKanban,
  Trash2,
  Shield,
} from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = { id: number; name: string }

type RolePermissionSummary = {
  module: string
  label: string
  actions: string[]
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

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ManageUserDialog({
  user,
  projects,
  assignedProjectIds,
  rolePermissions,
  canEdit,
  canDelete,
  isSelf,
}: {
  user: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
    emailVerified: boolean
    createdAt: string | Date
    memberSince: string | Date
  }
  projects: ProjectOption[]
  assignedProjectIds: number[]
  rolePermissions: RolePermissionSummary[]
  canEdit: boolean
  canDelete: boolean
  isSelf: boolean
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("details")
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState("")
  const [role, setRole] = useState(normalizeRole(user.role))
  const [selected, setSelected] = useState<number[]>(assignedProjectIds)

  const roleLabel = useMemo(() => {
    const key = normalizeRole(user.role) as OrgRole
    return ROLE_LABELS[key]?.en ?? user.role
  }, [user.role])

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setTab("details")
      setRole(normalizeRole(user.role))
      setSelected(assignedProjectIds)
      setConfirmDelete("")
    }
  }

  function onSaveProfile(formData: FormData) {
    formData.set("role", role)
    startTransition(async () => {
      const res = await updateMember(user.id, formData)
      if (res.ok) {
        toast.success("User updated")
        setOpen(false)
      } else {
        toast.error(res.error)
      }
    })
  }

  function onSaveAccess() {
    const fd = new FormData()
    fd.set("role", role)
    for (const id of selected) fd.append("projectId", String(id))
    startTransition(async () => {
      try {
        await setUserProjectAssignments(user.id, fd)
        toast.success("Access updated")
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed")
      }
    })
  }

  function onDelete() {
    if (confirmDelete.trim().toLowerCase() !== "delete") {
      toast.error('Type "delete" to confirm')
      return
    }
    startTransition(async () => {
      const res = await removeMember(user.id)
      if (res.ok) {
        toast.success("User removed")
        setOpen(false)
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Eye className="h-3.5 w-3.5" />
            Manage
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>User — {user.name}</DialogTitle>
          <DialogDescription>
            View details, edit profile, change role / project access, or remove
            the user.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
            {canEdit && <TabsTrigger value="access">Access</TabsTrigger>}
            {canDelete && !isSelf && (
              <TabsTrigger value="remove">Remove</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4">
              <Avatar className="h-16 w-16">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : null}
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-base font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{roleLabel}</Badge>
                  <Badge variant="outline">
                    {user.emailVerified ? "Email verified" : "Email unverified"}
                  </Badge>
                </div>
              </div>
              {canEdit && (
                <ManagePhotoDialog
                  userId={user.id}
                  userName={user.name}
                  image={user.image}
                />
              )}
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <dt className="text-xs text-muted-foreground">Member since</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(user.memberSince)}
                </dd>
              </div>
              <div className="rounded-md border p-3">
                <dt className="text-xs text-muted-foreground">Account created</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              <div className="rounded-md border p-3 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Projects</dt>
                <dd className="mt-2 flex flex-wrap gap-1">
                  {assignedProjectIds.length === 0 ? (
                    <span className="text-muted-foreground">No projects</span>
                  ) : (
                    projects
                      .filter((p) => assignedProjectIds.includes(p.id))
                      .map((p) => (
                        <Badge key={p.id} variant="outline" className="font-normal">
                          {p.name}
                        </Badge>
                      ))
                  )}
                </dd>
              </div>
            </dl>

            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Role permissions
              </div>
              {rolePermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No module access for this role.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {rolePermissions.map((row) => (
                    <li
                      key={row.module}
                      className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                    >
                      <span>{row.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {row.actions.join(", ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Permissions come from the user&apos;s role. Change the role in
                Edit / Access, or adjust the matrix in Settings → Roles.
              </p>
            </div>
          </TabsContent>

          {canEdit && (
            <TabsContent value="edit" className="mt-4">
              <form action={onSaveProfile} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`name-${user.id}`}>Full name</Label>
                  <Input
                    id={`name-${user.id}`}
                    name="name"
                    required
                    defaultValue={user.name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`email-${user.id}`}>Email</Label>
                  <Input
                    id={`email-${user.id}`}
                    name="email"
                    type="email"
                    required
                    defaultValue={user.email}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Role</Label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole(normalizeRole(v ?? "supervisor"))}
                    items={ROLE_OPTIONS}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`password-${user.id}`}>
                    New password (optional)
                  </Label>
                  <Input
                    id={`password-${user.id}`}
                    name="password"
                    type="text"
                    minLength={8}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={pending}>
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          )}

          {canEdit && (
            <TabsContent value="access" className="mt-4 space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(normalizeRole(v ?? "supervisor"))}
                  items={ROLE_OPTIONS}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Project access</Label>
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
                  {projects.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No projects yet.
                    </p>
                  )}
                  {projects.map((p) => {
                    const checked = selected.includes(p.id)
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border"
                          checked={checked}
                          onChange={() => {
                            setSelected((prev) =>
                              checked
                                ? prev.filter((id) => id !== p.id)
                                : [...prev, p.id],
                            )
                          }}
                        />
                        {p.name}
                      </label>
                    )
                  })}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={onSaveAccess} disabled={pending}>
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderKanban className="h-4 w-4" />
                  )}
                  Save access
                </Button>
              </DialogFooter>
            </TabsContent>
          )}

          {canDelete && !isSelf && (
            <TabsContent value="remove" className="mt-4 space-y-4">
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="font-medium text-destructive">Remove user</p>
                <p className="mt-1 text-muted-foreground">
                  This removes {user.name} from the organization and their
                  project assignments. If they belong to no other organization,
                  the login account is deleted permanently.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`confirm-${user.id}`}>
                  Type <span className="font-mono">delete</span> to confirm
                </Label>
                <Input
                  id={`confirm-${user.id}`}
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder="delete"
                  autoComplete="off"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  disabled={pending || confirmDelete.trim().toLowerCase() !== "delete"}
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove user
                </Button>
              </DialogFooter>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
