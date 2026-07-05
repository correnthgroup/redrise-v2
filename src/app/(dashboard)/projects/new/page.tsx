"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, FolderKanbanIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/hooks/use-i18n"
import { createProject } from "@/lib/projects"
import { effectiveBillingPlan, loadBillingSubscription } from "@/lib/billing"
import { supabase } from "@/lib/supabase"
import { loadSettingsAdminContext } from "@/lib/team-members"

export default function NewProjectPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [ownerUserId, setOwnerUserId] = React.useState<string>()
  const [canCreate, setCanCreate] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          if (!cancelled) setLoading(false)
          return
        }
        const context = await loadSettingsAdminContext(session.user.id)
        const subscription = await loadBillingSubscription(context.ownerUserId)
        if (!cancelled) {
          setOwnerUserId(context.ownerUserId)
          setCanCreate(effectiveBillingPlan(subscription) === "corporate")
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    if (!name.trim() || !ownerUserId || !canCreate) return
    try {
      setSaving(true)
      const project = await createProject({ name: name.trim(), description: description.trim(), image_url: imageUrl.trim() || null, ownerUserId })
      toast.success("Project created")
      router.push(project ? `/projects/${project.id}/resume` : "/projects")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Project could not be created")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex flex-col gap-4"><Skeleton className="h-10 w-56" /><Skeleton className="h-72 w-full" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("projects.new.header.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("projects.new.header.subtitle")}</p>
        </div>
        <Button onClick={handleSave} disabled={!canCreate || !name.trim() || saving} className="ml-auto">
          {saving && <Spinner className="mr-1" />}
          <SaveIcon className="size-4 mr-1" />
          Save
        </Button>
      </div>

      {!canCreate && (
        <Alert>
          <FolderKanbanIcon className="size-4" />
          <AlertTitle>Corporate plan required</AlertTitle>
          <AlertDescription>Upgrade to Corporate before creating organization projects.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Project name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the project..." rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl">Cover image URL</Label>
              <Input id="imageUrl" placeholder="https://..." value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="aspect-[3/2] rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {imageUrl ? <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" /> : <FolderKanbanIcon className="h-8 w-8 text-muted-foreground/50" />}
            </div>
            <div>
              <p className="font-medium">{name || "Project name"}</p>
              <p className="text-sm text-muted-foreground">{description || "Project description"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
