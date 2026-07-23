"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  removeMemberAvatar,
  updateMemberAvatar,
} from "@/app/actions/profile"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Trash2, Loader2 } from "lucide-react"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function ManagePhotoDialog({
  userId,
  userName,
  image,
}: {
  userId: string
  userName: string
  image: string | null
}) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const shown = preview || image

  function onFile(f: File | null) {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function onSave() {
    if (!file) {
      toast.error("Choose a photo first")
      return
    }
    const fd = new FormData()
    fd.set("userId", userId)
    fd.set("avatar", file)
    startTransition(async () => {
      const res = await updateMemberAvatar(fd)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Photo updated")
      setOpen(false)
      setFile(null)
      setPreview(null)
      router.refresh()
    })
  }

  function onRemove() {
    startTransition(async () => {
      const res = await removeMemberAvatar(userId)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Photo removed")
      setFile(null)
      setPreview(null)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setFile(null)
          setPreview(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Camera className="h-3.5 w-3.5" />
            Photo
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile photo</DialogTitle>
          <DialogDescription>
            Change or remove the photo for {userName}. It appears in the top bar
            after login.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar className="h-24 w-24 ring-2 ring-primary/15">
            {shown ? <AvatarImage src={shown} alt={userName} /> : null}
            <AvatarFallback className="text-lg">{initials(userName)}</AvatarFallback>
          </Avatar>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0] ?? null)
              e.target.value = ""
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Choose photo
          </Button>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onRemove}
            className="text-destructive"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Remove
          </Button>
          <Button type="button" disabled={pending || !file} onClick={onSave}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
