"use client"

import { addMember } from "@/app/actions/members"
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
import { ROLE_OPTIONS } from "@/lib/roles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Loader2, Camera } from "lucide-react"
import { useMemo, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

type ProjectOption = { id: number; name: string }

export function AddMemberDialog({
  projects = [],
}: {
  projects?: ProjectOption[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const projectItems = useMemo(
    () => projects.map((p) => ({ value: String(p.id), label: p.name })),
    [projects],
  )

  function resetLocal() {
    setSelectedProjects([])
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function onSubmit(formData: FormData) {
    if (selectedProjects.length > 0) {
      formData.set("projectIds", selectedProjects.join(","))
    }
    startTransition(async () => {
      const res = await addMember(formData)
      if (res.ok) {
        toast.success("User added")
        setOpen(false)
        resetLocal()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetLocal()
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <UserPlus className="h-4 w-4" />
            Add user
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>
              Create a login account with an org role and optional profile
              photo. The photo appears in the top bar after they sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <Avatar className="h-20 w-20 ring-2 ring-primary/15">
                {preview ? <AvatarImage src={preview} alt="Preview" /> : null}
                <AvatarFallback className="text-sm">Photo</AvatarFallback>
              </Avatar>
              <input
                ref={fileRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setPreview(f ? URL.createObjectURL(f) : null)
                }}
              />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  Choose photo
                </Button>
                {preview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreview(null)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Optional. If empty, an initials avatar is created.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Omar Hassan" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="omar@company.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  name="role"
                  defaultValue="supervisor"
                  items={ROLE_OPTIONS}
                >
                  <SelectTrigger id="role" className="w-full">
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
                <Label htmlFor="password">Temporary password</Label>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  required
                  minLength={8}
                  placeholder="min 8 characters"
                />
              </div>
            </div>
            {projectItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Assign to projects (optional)</Label>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                  {projectItems.map((p) => {
                    const checked = selectedProjects.includes(p.value)
                    return (
                      <label
                        key={p.value}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border"
                          checked={checked}
                          onChange={() => {
                            setSelectedProjects((prev) =>
                              checked
                                ? prev.filter((id) => id !== p.value)
                                : [...prev, p.value],
                            )
                          }}
                        />
                        {p.label}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
