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
import { AddSpaceMemberDialog } from "@/domains/workstation/spaces/dialogs/add-space-member-dialog"
import { SpaceMembersList } from "@/domains/workstation/spaces/components/space-members-list"
import type { Space } from "@/domains/workstation/spaces/types/space.types"

export function SpacesTable({ spaces }: { spaces: Space[] }) {
  const [membersSpace, setMembersSpace] = React.useState<Space | null>(null)

  function handleBlockedAction(action: string, space: Space) {
    toast(`${action} for ${space.name} is not available in this PRD.`, {
      description: "This action will be connected when Spaces persistence and permissions are implemented.",
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-1.5">
            <CardTitle>Spaces List</CardTitle>
            <CardDescription>Mocked Spaces with row actions based on table-02 behavior.</CardDescription>
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
                        <DropdownMenuItem onClick={() => handleBlockedAction("View", space)}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBlockedAction("Edit", space)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleBlockedAction("Archive", space)}>Archive</DropdownMenuItem>
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
                <AddSpaceMemberDialog spaceName={membersSpace.name} />
              </div>
              <SpaceMembersList space={membersSpace} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
