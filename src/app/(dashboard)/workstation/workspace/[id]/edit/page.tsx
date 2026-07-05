"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useWorkspaces } from "@/hooks/use-workspaces"
import type { Workspace } from "@/types/workspace"

function WorkspaceEditForm({
  workspace,
  onSave,
}: {
  workspace: Workspace
  onSave: (updates: { name: string; mission: string; flows: number }) => Promise<boolean>
}) {
  const [name, setName] = React.useState(workspace.name)
  const [mission, setMission] = React.useState(workspace.mission)
  const [flowsEnabled, setFlowsEnabled] = React.useState(workspace.flows > 0)
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Space name is required")
      return
    }

    setSaving(true)
    const saved = await onSave({
      name: trimmedName,
      mission: mission.trim(),
      flows: flowsEnabled ? 1 : 0,
    })
    setSaving(false)

    if (saved) toast.success("Space updated")
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger render={
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeftIcon className="size-4" />
            </Button>
          } />
          <TooltipContent><p>Go back</p></TooltipContent>
        </Tooltip>
        <div>
          <h1 className="text-lg font-semibold">Edit Space</h1>
          <p className="text-sm text-muted-foreground">Update persisted workspace settings.</p>
        </div>
        <Tooltip>
          <TooltipTrigger render={
            <Button onClick={handleSave} disabled={saving} className="ml-auto">
              {saving && <Spinner className="mr-1" />}
              <SaveIcon className="mr-1 size-4" />
              Save
            </Button>
          } />
          <TooltipContent><p>Save changes</p></TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
              <CardDescription>Stored in the Supabase `workspaces` table.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Space name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mission">Mission / Playbook</Label>
                  <Textarea
                    id="mission"
                    placeholder="Write the mission, playbook, or objectives for this workspace..."
                    rows={8}
                    value={mission}
                    onChange={(event) => setMission(event.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">{mission.length} chars</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label>Flows</Label>
                <p className="text-xs text-muted-foreground">Enable workflow flows</p>
              </div>
              <Switch checked={flowsEnabled} onCheckedChange={setFlowsEnabled} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function EditWorkspacePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { workspaces, loading, updateWorkspace } = useWorkspaces()
  const workspace = workspaces.find((item) => item.id === params.id) ?? null

  const handleSave = async (updates: { name: string; mission: string; flows: number }) => {
    const saved = await updateWorkspace(params.id, updates)
    if (!saved) {
      toast.error("Unable to update space")
      return false
    }

    router.push("/workstation/workspace")
    return true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workstation/workspace")}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Space not found</h1>
            <p className="text-sm text-muted-foreground">The workspace you are trying to edit does not exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceEditForm key={workspace.id} workspace={workspace} onSave={handleSave} />
    </div>
  )
}
