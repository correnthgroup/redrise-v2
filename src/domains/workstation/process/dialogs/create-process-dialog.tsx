"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { RouteIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { createProcessSchema, type CreateProcessInput } from "@/domains/workstation/process/schemas/process.schemas"
import { nodeTypes, processFrequencies } from "@/domains/workstation/process/types/process.types"

export function CreateProcessDialog() {
  const { repository, snapshot, can } = useWorkstation()
  const [open, setOpen] = React.useState(false)
  const firstSpace = snapshot.spaces.find((space) => space.status !== "Archived")
  const form = useForm<CreateProcessInput>({
    resolver: zodResolver(createProcessSchema),
    values: { spaceId: firstSpace?.id ?? "", name: "", description: "", frequency: "manual", owner: snapshot.currentUser.name, initialNodeType: "llm" },
    resetOptions: { keepDefaultValues: true },
  })
  const spaces = snapshot.spaces.filter((space) => space.status !== "Archived")
  const owners = snapshot.members.filter((member) => member.status === "accepted")

  async function submit(input: CreateProcessInput) {
    if (!can("process.manage", input.spaceId)) return void toast.error("You do not have permission to create a Process in this Space.")
    try {
      await repository.createProcess(input)
      toast.success("Process " + input.name + " created.")
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create Process.")
    }
  }

  if (!can("process.manage")) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" />}>New Process</DialogTrigger>
      <DialogContent className="gap-0 overflow-visible p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4"><DialogTitle>Create Process</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex flex-col justify-between md:w-72 md:border-r">
              <div className="border-t p-6 md:border-none">
                <div className="flex items-center gap-3"><div className="rounded-sm bg-muted p-3"><RouteIcon className="size-5" /></div><div><h3 className="text-sm font-medium">Process Starter</h3><p className="text-sm text-muted-foreground">Operational flow</p></div></div>
                <Separator className="my-4" />
                <p className="text-sm leading-6 text-muted-foreground">Creates a Process with its first configurable node in the in-memory repository.</p>
              </div>
              <div className="flex items-center justify-between border-t p-4"><DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose><Button type="submit" size="sm">Create</Button></div>
            </div>
            <div className="flex-1 space-y-5 p-6">
              <div className="grid gap-2"><Label>Space</Label><Controller control={form.control} name="spaceId" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue placeholder="Select Space" /></SelectTrigger><SelectContent>{spaces.map((space) => <SelectItem key={space.id} value={space.id}>{space.name}</SelectItem>)}</SelectContent></Select>} /></div>
              <div className="grid gap-2"><Label>Name</Label><Input {...form.register("name")} placeholder="Invoice Exception Review" />{form.formState.errors.name ? <p className="text-xs text-destructive">{form.formState.errors.name.message}</p> : null}</div>
              <div className="grid gap-2"><Label>Description</Label><Textarea {...form.register("description")} placeholder="Describe what this Process coordinates." /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Controller control={form.control} name="frequency" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{processFrequencies.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>} />
                <Controller control={form.control} name="owner" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{owners.map((member) => <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>)}</SelectContent></Select>} />
              </div>
              <div className="grid gap-2"><Label>Initial Node</Label><Controller control={form.control} name="initialNodeType" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{nodeTypes.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>} /></div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}