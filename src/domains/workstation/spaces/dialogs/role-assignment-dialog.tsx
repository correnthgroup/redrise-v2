"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { addSpaceMemberSchema, type AddSpaceMemberInput } from "@/domains/workstation/spaces/schemas/space.schemas"
import { spaceRoles } from "@/domains/workstation/spaces/types/space.types"

export function RoleAssignmentDialog({ open, onOpenChange, spaceId, spaceName }: { open: boolean; onOpenChange: (open: boolean) => void; spaceId: string; spaceName: string }) {
  const { repository, snapshot, can } = useWorkstation()
  const form = useForm<AddSpaceMemberInput>({ resolver: zodResolver(addSpaceMemberSchema), defaultValues: { memberId: "", role: "User" } })
  const members = snapshot.members.filter((member) => member.status === "accepted")

  async function submit(input: AddSpaceMemberInput) {
    if (!can("space.members.manage", spaceId)) return void toast.error("You do not have permission to manage members in this Space.")
    try {
      await repository.addSpaceMember(spaceId, input)
      toast.success(`Member assigned to ${spaceName} as ${input.role}.`)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not assign member.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Assign Space Role</DialogTitle><DialogDescription>Choose an accepted member for {spaceName}.</DialogDescription></DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-2"><Label>Member</Label><Controller control={form.control} name="memberId" render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}><SelectTrigger className="w-full"><SelectValue placeholder="Select member" /></SelectTrigger><SelectContent>{members.map((member) => <SelectItem key={member.id} value={member.id}>{member.name} · {member.organizationRole}</SelectItem>)}</SelectContent></Select>
          )} /></div>
          <div className="grid gap-2"><Label>Space Role</Label><Controller control={form.control} name="role" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{spaceRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select>
          )} /></div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit">Assign role</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}