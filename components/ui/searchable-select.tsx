"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

export type SearchableOption = {
  value: string
  label: string
  /** Extra text matched by search (e.g. email, code, supervisor name). */
  keywords?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search…",
  emptyText = "No results",
  disabled,
  id,
}: {
  options: SearchableOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  id?: string
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selected = options.find((o) => o.value === value) ?? null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      const hay = `${o.label} ${o.keywords ?? ""}`.toLowerCase()
      return hay.includes(q)
    })
  }, [options, query])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((v) => !v)
          setQuery("")
        }}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-muted-foreground",
        )}
      >
        <span className="truncate text-left">
          {selected?.label ?? placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {selected && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
                setQuery("")
              }}
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md">
          <div className="flex items-center gap-2 border-b px-2.5 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="h-7 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <ul
            id={listId}
            role="listbox"
            className="max-h-56 overflow-y-auto p-1"
          >
            {filtered.length === 0 && (
              <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                {emptyText}
              </li>
            )}
            {filtered.map((opt) => {
              const active = opt.value === value
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/70",
                    )}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                      setQuery("")
                    }}
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{opt.label}</span>
                      {opt.keywords && (
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {opt.keywords}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
