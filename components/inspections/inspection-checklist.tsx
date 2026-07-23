"use client"

import {
  deleteChecklistItem,
  saveItemAnswer,
  uploadItemPhoto,
} from "@/app/actions/inspections"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/lib/stage-form"
import { cn } from "@/lib/utils"
import {
  Check,
  X,
  Minus,
  Trash2,
  Loader2,
  Camera,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

export type ChecklistItem = {
  id: number
  label: string
  result: string
  comment: string | null
  questionType: string
  answer: unknown
  photoUrls: unknown
  options: unknown
  requirePhoto: boolean
  allowText?: boolean
}

const passFailOptions: {
  value: "pass" | "fail" | "na"
  icon: typeof Check
  label: string
  active: string
}[] = [
  {
    value: "pass",
    icon: Check,
    label: "Pass",
    active: "bg-success text-success-foreground border-success",
  },
  {
    value: "fail",
    icon: X,
    label: "Fail",
    active:
      "bg-destructive text-destructive-foreground border-destructive",
  },
  {
    value: "na",
    icon: Minus,
    label: "N/A",
    active: "bg-muted-foreground text-background border-muted-foreground",
  },
]

function asPhotos(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : []
}

function asOptions(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]).map(String) : []
}

export function InspectionChecklist({
  inspectionId,
  items,
  editable,
}: {
  inspectionId: number
  items: ChecklistItem[]
  editable: boolean
}) {
  const [pending, startTransition] = useTransition()

  function run(action: () => Promise<void>, errorFallback: string) {
    startTransition(async () => {
      try {
        await action()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : errorFallback)
      }
    })
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y">
        {items.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No form questions yet. Create a stage form for this project, then
            start an inspection from that stage.
          </li>
        )}
        {items.map((item, idx) => (
          <QuestionRow
            key={item.id}
            item={item}
            index={idx}
            editable={editable}
            pending={pending}
            onDelete={() =>
              run(
                () => deleteChecklistItem(item.id, inspectionId),
                "Failed to delete item",
              )
            }
            onSave={(payload) =>
              run(
                () => saveItemAnswer(item.id, inspectionId, payload),
                "Failed to save answer",
              )
            }
            onUpload={(file) =>
              run(async () => {
                const fd = new FormData()
                fd.set("photo", file)
                await uploadItemPhoto(item.id, inspectionId, fd)
                toast.success("Photo uploaded")
              }, "Failed to upload photo")
            }
          />
        ))}
      </ul>
    </div>
  )
}

function TextAnswer({
  initial,
  editable,
  pending,
  onSave,
}: {
  initial: string
  editable: boolean
  pending: boolean
  onSave: (payload: {
    result?: "pass" | "fail" | "na" | "pending"
    answer?: unknown
    comment?: string | null
  }) => void
}) {
  const [value, setValue] = useState(initial)
  return (
    <Textarea
      value={value}
      disabled={!editable || pending}
      rows={3}
      placeholder="Type your answer…"
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== initial) {
          onSave({
            answer: value,
            result: value.trim() ? "pass" : "pending",
          })
        }
      }}
    />
  )
}

function QuestionRow({
  item,
  index,
  editable,
  pending,
  onDelete,
  onSave,
  onUpload,
}: {
  item: ChecklistItem
  index: number
  editable: boolean
  pending: boolean
  onDelete: () => void
  onSave: (payload: {
    result?: "pass" | "fail" | "na" | "pending"
    answer?: unknown
    comment?: string | null
  }) => void
  onUpload: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [comment, setComment] = useState(item.comment ?? "")
  const type = (item.questionType || "pass_fail") as QuestionType
  const photos = asPhotos(item.photoUrls)
  const options = asOptions(item.options)
  const multi =
    Array.isArray(item.answer) ? (item.answer as string[]) : ([] as string[])
  const allowText = item.allowText !== false || type === "text"

  return (
    <li className="flex flex-col gap-3 px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 w-6 shrink-0 font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {QUESTION_TYPE_LABELS[type] ?? type}
            {item.requirePhoto ? " · photo required" : ""}
            {allowText && type !== "text" ? " · text allowed" : ""}
          </p>
        </div>
        {editable && type === "pass_fail" && (
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            aria-label="Delete item"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 pl-9">
        {type === "pass_fail" && (
          <div className="flex items-center gap-1">
            {passFailOptions.map((opt) => {
              const Icon = opt.icon
              const isActive = item.result === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={!editable || pending}
                  onClick={() => onSave({ result: opt.value })}
                  aria-label={opt.label}
                  title={opt.label}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors disabled:opacity-60",
                    isActive
                      ? opt.active
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {type === "text" && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Answer text
            </span>
            <TextAnswer
              initial={typeof item.answer === "string" ? item.answer : ""}
              editable={editable}
              pending={pending}
              onSave={onSave}
            />
          </div>
        )}

        {type === "checkbox" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border"
              checked={item.answer === true}
              disabled={!editable || pending}
              onChange={(e) =>
                onSave({
                  answer: e.target.checked,
                  result: "pass",
                })
              }
            />
            Confirmed / Yes
          </label>
        )}

        {type === "single_choice" && (
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`q-${item.id}`}
                  className="size-4 border"
                  checked={item.answer === opt}
                  disabled={!editable || pending}
                  onChange={() =>
                    onSave({ answer: opt, result: "pass" })
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {type === "multi_choice" && (
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const checked = multi.includes(opt)
              return (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 rounded border"
                    checked={checked}
                    disabled={!editable || pending}
                    onChange={() => {
                      const next = checked
                        ? multi.filter((v) => v !== opt)
                        : [...multi, opt]
                      onSave({
                        answer: next,
                        result: next.length > 0 ? "pass" : "pending",
                      })
                    }}
                  />
                  {opt}
                </label>
              )
            })}
          </div>
        )}

        {(type === "photo" || item.requirePhoto) && (
          <div className="flex flex-col gap-2">
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative h-16 w-20 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={url}
                      alt="Evidence"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </a>
                ))}
              </div>
            )}
            {editable && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onUpload(file)
                    e.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  className="w-fit"
                  onClick={() => fileRef.current?.click()}
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : photos.length ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  {photos.length ? "Add another photo" : "Upload photo"}
                </Button>
              </>
            )}
          </div>
        )}

        {allowText && type !== "text" && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Answer text
            </span>
            {editable ? (
              <Textarea
                value={comment}
                rows={2}
                placeholder="Add explanation or notes with this answer…"
                disabled={pending}
                onChange={(e) => setComment(e.target.value)}
                onBlur={() => {
                  if ((item.comment ?? "") !== comment) {
                    onSave({ comment: comment.trim() || null })
                  }
                }}
              />
            ) : item.comment ? (
              <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap">
                {item.comment}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No text provided</p>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
