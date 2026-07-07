"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { acceptedOrganizationMembers } from "@/domains/workstation/spaces/data/mock-spaces"
import { createSpaceSchema } from "@/domains/workstation/spaces/schemas/space.schemas"
import { spaceRoles, type SpaceRole } from "@/domains/workstation/spaces/types/space.types"
import { cn } from "@/lib/utils"

type WizardMember = {
  memberId: string
  role: SpaceRole | ""
}

const steps = ["Space Details", "Members & Roles", "Review"] as const

export function CreateSpaceDialog() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [members, setMembers] = React.useState<WizardMember[]>([{ memberId: "", role: "" }])
  const [error, setError] = React.useState<string | null>(null)

  function reset() {
    setStep(0)
    setName("")
    setDescription("")
    setMembers([{ memberId: "", role: "" }])
    setError(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) reset()
  }

  function validMembers() {
    return members.filter((member) => member.memberId && member.role) as Array<{ memberId: string; role: SpaceRole }>
  }

  function handleNext() {
    if (step === 0) {
      const parsed = createSpaceSchema.pick({ name: true, description: true }).safeParse({ name, description })
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Complete the Space details."
        setError(message)
        toast.error(message)
        return
      }
    }
    setError(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function handleCreate() {
    const parsed = createSpaceSchema.safeParse({ name, description, members: validMembers() })
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Review the Space details."
      setError(message)
      toast.error(message)
      return
    }

    toast.success(`Space ${parsed.data.name} created.`, {
      description: "Mocked locally for this PRD. Supabase persistence comes later.",
    })
    setOpen(false)
    reset()
  }

  function updateMember(index: number, patch: Partial<WizardMember>) {
    setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? { ...member, ...patch } : member))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>New Workspace</DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="rounded-xl bg-muted p-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-SPACE-CREATE</p>
            <h2 className="mt-3 text-xl font-semibold">Create New Space</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Spaces group members, roles, Processes and Actions into operational boundaries.
            </p>
            <div className="mt-6 grid gap-2">
              {steps.map((item, index) => (
                <div key={item} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm", index === step ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
                  <span className="flex size-5 items-center justify-center rounded-full border text-xs">{index < step ? <CheckIcon className="size-3" /> : index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-5">
            <DialogHeader>
              <DialogTitle>{steps[step]}</DialogTitle>
              <DialogDescription>Create a Space with optional accepted members and Space-specific roles.</DialogDescription>
            </DialogHeader>

            {step === 0 ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="space-name">Name</Label>
                  <Input id="space-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Finance Operations" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="space-description">Description</Label>
                  <Textarea id="space-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the work this Space will contain." />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4">
                {members.map((member, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border p-3 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Accepted member</Label>
                      <Select value={member.memberId} onValueChange={(value) => updateMember(index, { memberId: value ?? "" })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select member" /></SelectTrigger>
                        <SelectContent>
                          {acceptedOrganizationMembers.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Space Role</Label>
                      <Select value={member.role} onValueChange={(value) => updateMember(index, { role: (value ?? "") as SpaceRole | "" })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>{spaceRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setMembers((current) => [...current, { memberId: "", role: "" }])}>Add another member</Button>
                <p className="text-sm text-muted-foreground">Only accepted organization members are listed. Space Role does not alter Organization Role.</p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 rounded-lg border p-4 text-sm">
                <div><span className="font-medium">Name:</span> {name || "Not set"}</div>
                <div><span className="font-medium">Description:</span> {description || "Not set"}</div>
                <div><span className="font-medium">Members:</span> {validMembers().length || "No initial members"}</div>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => step === 0 ? setOpen(false) : setStep((current) => current - 1)}>{step === 0 ? "Cancel" : "Back"}</Button>
              {step < steps.length - 1 ? <Button type="button" onClick={handleNext}>Next</Button> : <Button type="button" onClick={handleCreate}>Create Space</Button>}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
