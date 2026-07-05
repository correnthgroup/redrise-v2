"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

export default function NewWorkspacePage() {
  const router = useRouter()
  const { addWorkspace } = useWorkspaces()
  const [name, setName] = React.useState("")
  const [mission, setMission] = React.useState("")
  const [flowsEnabled, setFlowsEnabled] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Space name is required")
      return
    }

    setSaving(true)
    const workspace = await addWorkspace({
      name: trimmedName,
      mission: mission.trim(),
      flows: flowsEnabled ? 1 : 0,
    })
    setSaving(false)

    if (!workspace) {
      toast.error("Unable to create space")
      return
    }

    toast.success("Space created successfully")
    router.push("/workstation/workspace")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/workstation/workspace")}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">New Space</h1>
          <p className="text-sm text-muted-foreground">Create a new operational workspace.</p>
        </div>
        <Tooltip>
          <TooltipTrigger render={
            <Button onClick={handleSave} disabled={saving} className="ml-auto">
              {saving && <Spinner className="mr-1" />}
              <SaveIcon className="mr-1 size-4" />
              Save
            </Button>
          } />
          <TooltipContent>
            <p>Save space</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
              <CardDescription>Persisted in Supabase as workspace fields.</CardDescription>
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
    </div>
  )
}
