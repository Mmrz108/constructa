"use client"

import { createChecklistTemplate } from "@/app/actions/checklists"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function CreateChecklistDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createChecklistTemplate(formData)
        toast.success("Template created")
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create template")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            New template
          </Button>
        }
      />
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>New checklist template</DialogTitle>
            <DialogDescription>
              Reusable inspection checklist. Publish revisions to create new
              versions.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Template name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Rebar / reinforcement inspection"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="discipline">Discipline</Label>
              <Input
                id="discipline"
                name="discipline"
                placeholder="Structural"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="items">Checklist items (one per line)</Label>
              <Textarea
                id="items"
                name="items"
                rows={6}
                required
                placeholder={"Rebar spacing per drawing\nCover blocks in place\nLap length verified\nNo corrosion / contamination"}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
