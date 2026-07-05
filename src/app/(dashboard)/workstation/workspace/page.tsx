"use client"

import { useRouter } from "next/navigation"
import { FileTextIcon, LayoutGrid, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useI18n } from "@/hooks/use-i18n"
import { useWorkspaces } from "@/hooks/use-workspaces"
import type { Workspace } from "@/types/workspace"
import * as React from "react"

function DeleteWorkspaceDialog({
  workspace,
  onDelete,
  open,
  onOpenChange,
}: {
  workspace: Workspace
  onDelete: (id: string) => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [confirmText, setConfirmText] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)
  const canDelete = confirmText === "Delete"

  const handleDelete = async () => {
    if (!canDelete) return
    setDeleting(true)
    await onDelete(workspace.id)
    setDeleting(false)
    setConfirmText("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); setConfirmText("") }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Space</DialogTitle>
          <DialogDescription>
            Type <strong>Delete</strong> to confirm deletion of &quot;{workspace.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`confirm-delete-${workspace.id}`}>Confirmation</Label>
          <Input
            id={`confirm-delete-${workspace.id}`}
            placeholder='Type "Delete" to confirm'
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" disabled={!canDelete || deleting} onClick={handleDelete}>
            {deleting && <Spinner className="mr-1" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WorkspaceCard({ workspace, onDelete }: { workspace: Workspace; onDelete: (id: string) => Promise<void> }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const description = workspace.mission.trim() || `Status: ${workspace.status}`

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Item className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20" />}>
          <ItemHeader className="flex aspect-[3/2] items-center justify-center overflow-hidden bg-muted">
            <LayoutGrid className="size-8 text-muted-foreground/50" />
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{workspace.name}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => router.push(`/workstation/workspace/${workspace.id}/resume`)}>
            <FileTextIcon className="size-4" />
            Resume
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/workstation/workspace/${workspace.id}/edit`)}>
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkspaceDialog workspace={workspace} onDelete={onDelete} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}

function ViewWorkspaces({ workspaces, onDelete }: { workspaces: Workspace[]; onDelete: (id: string) => Promise<void> }) {
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No spaces yet. Click &quot;New Space&quot; to create one.</p>
      </div>
    )
  }

  return (
    <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} onDelete={onDelete} />
      ))}
    </ItemGroup>
  )
}

export default function WorkspacePage() {
  const router = useRouter()
  const { t } = useI18n()
  const { workspaces, loading, removeWorkspace } = useWorkspaces()

  const handleDelete = async (id: string) => {
    const removed = await removeWorkspace(id)
    if (removed) {
      toast.success("Space deleted")
      return
    }
    toast.error("Unable to delete space")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t("workstation.workspace.header.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("workstation.workspace.header.subtitle")}</p>
        </div>
        <Tooltip>
          <TooltipTrigger render={
            <Button onClick={() => router.push("/workstation/workspace/new")}>
              <PlusIcon className="mr-1 size-4" />
              New Space
            </Button>
          } />
          <TooltipContent>
            <p>Create a new workspace</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Spinner className="mr-2" />
          Loading spaces...
        </div>
      ) : (
        <ViewWorkspaces workspaces={workspaces} onDelete={handleDelete} />
      )}
    </div>
  )
}
