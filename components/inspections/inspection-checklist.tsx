"use client"

import {
  addChecklistItem,
  deleteChecklistItem,
  setItemResult,
} from "@/app/actions/inspections"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, X, Minus, Trash2, Plus, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export type ChecklistItem = {
  id: number
  label: string
  result: string
  comment: string | null
}

const options: { value: "pass" | "fail" | "na"; icon: typeof Check; label: string; active: string }[] =
  [
    { value: "pass", icon: Check, label: "Pass", active: "bg-success text-success-foreground border-success" },
    { value: "fail", icon: X, label: "Fail", active: "bg-destructive text-destructive-foreground border-destructive" },
    { value: "na", icon: Minus, label: "N/A", active: "bg-muted-foreground text-background border-muted-foreground" },
  ]

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
  const [newLabel, setNewLabel] = useState("")

  function handleResult(itemId: number, result: "pass" | "fail" | "na") {
    startTransition(async () => {
      try {
        await setItemResult(itemId, inspectionId, result)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update item")
      }
    })
  }

  function handleAdd() {
    if (!newLabel.trim()) return
    startTransition(async () => {
      try {
        await addChecklistItem(inspectionId, newLabel)
        setNewLabel("")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to add item")
      }
    })
  }

  function handleDelete(itemId: number) {
    startTransition(async () => {
      try {
        await deleteChecklistItem(itemId, inspectionId)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete item")
      }
    })
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y">
        {items.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No checklist items yet.
            {editable && " Add items below to build the checklist."}
          </li>
        )}
        {items.map((item, idx) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm">{item.label}</span>
            <div className="flex items-center gap-1">
              {options.map((opt) => {
                const Icon = opt.icon
                const isActive = item.result === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={!editable || pending}
                    onClick={() => handleResult(item.id, opt.value)}
                    aria-label={opt.label}
                    title={opt.label}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md border transition-colors disabled:opacity-60",
                      isActive
                        ? opt.active
                        : "border-border text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                )
              })}
              {editable && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete item"
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {editable && (
        <div className="flex items-center gap-2 border-t p-3">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Add checklist item..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAdd}
            disabled={pending || !newLabel.trim()}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
