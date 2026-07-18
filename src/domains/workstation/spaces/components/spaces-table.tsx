"use client"

import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { AddSpaceMemberDialog } from "@/domains/workstation/spaces/dialogs/add-space-member-dialog"
import { SpaceMembersList } from "@/domains/workstation/spaces/components/space-members-list"
import type { Space } from "@/domains/workstation/spaces/types/space.types"

export function SpacesTable({ spaces }: { spaces: Space[] }) {
  const { repository, can } = useWorkstation()
  const [membersSpace, setMembersSpace] = React.useState<Space | null>(null)

  async function editSpace(space: Space) {
    if (!can("space.manage", space.id)) return void toast.error("You do not have permission to edit this Space.")
    const name = window.prompt("Space name", space.name)?.trim()
    if (!name) return
    const description = window.prompt("Space description", space.description)?.trim()
    if (!description) return
    await repository.updateSpace(space.id, { name, description })
    toast.success("Space updated.")
  }

  async function archiveSpace(space: Space) {
    if (!can("space.manage", space.id)) return void toast.error("You do not have permission to archive this Space.")
    await repository.archiveSpace(space.id)
    toast.success(space.name + " archived.")
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-1.5">
            <CardTitle>Spaces List</CardTitle>
            <CardDescription>Session-backed Spaces managed through the Workstation repository.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Space name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Roles summary</TableHead>
                <TableHead>Processes</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium">
                    <div className="grid gap-1">
                      <span>{space.name}</span>
                      <Badge variant={space.status === "Active" ? "outline" : "secondary"} className="w-fit">{space.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px] whitespace-normal text-muted-foreground">{space.description}</TableCell>
                  <TableCell>{space.membersCount}</TableCell>
                  <TableCell>{space.rolesSummary}</TableCell>
                  <TableCell>{space.processesCount}</TableCell>
                  <TableCell>{space.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Open actions for ${space.name}`} />}>
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => setMembersSpace(space)}>Manage members</DropdownMenuItem>

                        {can("space.manage", space.id) ? <DropdownMenuItem onClick={() => void editSpace(space)}>Edit</DropdownMenuItem> : null}
                        <DropdownMenuSeparator />
                        {can("space.manage", space.id) ? <DropdownMenuItem variant="destructive" onClick={() => void archiveSpace(space)}>Archive</DropdownMenuItem> : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(membersSpace)} onOpenChange={(open) => !open && setMembersSpace(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Space Members</DialogTitle>
            <DialogDescription>Add accepted organization members and assign Space-specific roles.</DialogDescription>
          </DialogHeader>
          {membersSpace ? (
            <div className="grid gap-4">
              <div className="flex justify-end">
                <AddSpaceMemberDialog spaceId={membersSpace.id} spaceName={membersSpace.name} />
              </div>
              <SpaceMembersList space={membersSpace} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
