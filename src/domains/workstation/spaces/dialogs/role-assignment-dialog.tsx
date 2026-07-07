"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addSpaceMemberSchema } from "@/domains/workstation/spaces/schemas/space.schemas"
import { acceptedOrganizationMembers } from "@/domains/workstation/spaces/data/mock-spaces"
import { spaceRoles, type SpaceRole } from "@/domains/workstation/spaces/types/space.types"

type RoleAssignmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceName: string
}

export function RoleAssignmentDialog({ open, onOpenChange, spaceName }: RoleAssignmentDialogProps) {
  const [memberId, setMemberId] = React.useState("")
  const [role, setRole] = React.useState<SpaceRole | "">("")
  const [error, setError] = React.useState<string | null>(null)

  function handleSave() {
    const parsed = addSpaceMemberSchema.safeParse({ memberId, role })
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Select a member and role."
      setError(message)
      toast.error(message)
      return
    }

    const member = acceptedOrganizationMembers.find((item) => item.id === parsed.data.memberId)
    toast.success(`${member?.name ?? "Member"} assigned as ${parsed.data.role} in ${spaceName}.`)
    setMemberId("")
    setRole("")
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Space Role</DialogTitle>
          <DialogDescription>
            Select an accepted organization member and assign a role only for {spaceName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Accepted member</Label>
            <Select value={memberId} onValueChange={(value) => setMemberId(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {acceptedOrganizationMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>{member.name} · {member.organizationRole}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Space Role</Label>
            <Select value={role} onValueChange={(value) => setRole((value ?? "") as SpaceRole | "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Space role" />
              </SelectTrigger>
              <SelectContent>
                {spaceRoles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            Space Role does not alter Organization Role. Backend persistence will be connected in a later Supabase PRD.
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Assign role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
