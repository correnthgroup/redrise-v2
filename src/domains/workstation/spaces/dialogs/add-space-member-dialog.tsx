"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { RoleAssignmentDialog } from "@/domains/workstation/spaces/dialogs/role-assignment-dialog"

export function AddSpaceMemberDialog({ spaceId, spaceName }: { spaceId: string; spaceName: string }) {
  const [open, setOpen] = React.useState(false)
  return <><Button type="button" variant="outline" onClick={() => setOpen(true)}>Add Member</Button><RoleAssignmentDialog open={open} onOpenChange={setOpen} spaceId={spaceId} spaceName={spaceName} /></>
}