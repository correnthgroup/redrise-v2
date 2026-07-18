"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Layers3Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { createSpaceSchema, type CreateSpaceInput } from "@/domains/workstation/spaces/schemas/space.schemas"

const defaults: CreateSpaceInput = { name: "", description: "", members: [] }

export function CreateSpaceDialog() {
  const { repository, can } = useWorkstation()
  const [open, setOpen] = React.useState(false)
  const form = useForm<CreateSpaceInput>({ resolver: zodResolver(createSpaceSchema), defaultValues: defaults })

  async function submit(input: CreateSpaceInput) {
    if (!can("space.manage")) return void toast.error("You do not have permission to create Spaces.")
    try {
      await repository.createSpace(input)
      toast.success(`Space ${input.name} created.`, { description: "Stored in the active in-memory session." })
      form.reset(defaults)
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create Space.")
    }
  }

  if (!can("space.manage")) return null

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) form.reset(defaults) }}>
      <DialogTrigger render={<Button type="button" />}>New Workspace</DialogTrigger>
      <DialogContent className="gap-0 overflow-visible p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4"><DialogTitle>Create New Space</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex flex-col justify-between md:w-72 md:border-r">
              <div className="border-t p-6 md:border-none">
                <div className="flex items-center gap-3">
                  <div className="rounded-sm bg-muted p-3"><Layers3Icon className="size-5" /></div>
                  <div><h3 className="text-sm font-medium">Space Starter</h3><p className="text-sm text-muted-foreground">Operational boundary</p></div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm leading-6 text-muted-foreground">Members and Space Roles can be assigned immediately after creation. State resets when the application reloads.</p>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose>
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>Create</Button>
              </div>
            </div>
            <div className="flex-1 space-y-5 p-6">
              <div className="grid gap-2">
                <Label htmlFor="space-name">Name</Label>
                <Input id="space-name" {...form.register("name")} placeholder="Finance Operations" />
                {form.formState.errors.name ? <p className="text-xs text-destructive">{form.formState.errors.name.message}</p> : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="space-description">Description</Label>
                <Textarea id="space-description" {...form.register("description")} placeholder="Describe the work this Space will contain." />
                {form.formState.errors.description ? <p className="text-xs text-destructive">{form.formState.errors.description.message}</p> : null}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}