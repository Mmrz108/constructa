"use client"

import { useRef, useTransition } from "react"
import { toast } from "sonner"
import { removeMyAvatar, updateMyAvatar } from "@/app/actions/profile"
import { useRouter } from "next/navigation"
import { Camera, Trash2 } from "lucide-react"

export function AvatarUploadButton({
  canRemove = true,
}: {
  canRemove?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function onPick(file: File | null) {
    if (!file) return
    const fd = new FormData()
    fd.set("avatar", file)
    startTransition(async () => {
      const res = await updateMyAvatar(fd)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Photo updated")
      router.refresh()
    })
  }

  function onRemove() {
    startTransition(async () => {
      const res = await removeMyAvatar()
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Photo removed")
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-0.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onPick(e.target.files?.[0] ?? null)
          e.target.value = ""
        }}
      />
      <button
        type="button"
        disabled={pending}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        {pending ? "Working…" : "Change photo"}
      </button>
      {canRemove && (
        <button
          type="button"
          disabled={pending}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-accent disabled:opacity-50"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
          Remove photo
        </button>
      )}
    </div>
  )
}
