"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
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
import { effectiveBillingPlan, loadBillingSubscription } from "@/lib/billing"
import { getProject, updateProject } from "@/lib/projects"
import { supabase } from "@/lib/supabase"
import { loadSettingsAdminContext } from "@/lib/team-members"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useI18n()
  const id = params.id as string
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [canEdit, setCanEdit] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [{ data: { session } }, project] = await Promise.all([
          supabase.auth.getSession(),
          getProject(id),
        ])

        if (!cancelled && project) {
          setName(project.name)
          setDescription(project.description)
          setImageUrl(project.image_url ?? "")
        }

        if (session?.user) {
          const context = await loadSettingsAdminContext(session.user.id)
          const subscription = await loadBillingSubscription(context.ownerUserId)
          if (!cancelled) setCanEdit(effectiveBillingPlan(subscription) === "corporate")
        }
      } catch {
        // Keep the form disabled when Supabase is unavailable.
      }

      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [id])

  const handleSave = async () => {
    if (!name.trim() || !canEdit) return
    try {
      setSaving(true)
      await updateProject(id, {
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || null,
      })
      toast.success("Project updated")
      router.push(`/projects/${id}/resume`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Project could not be updated")
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
          <h1 className="text-2xl font-semibold tracking-tight">{t("projects.edit.header.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("projects.edit.header.subtitle")}</p>
        </div>
        <Button onClick={handleSave} disabled={!canEdit || !name.trim() || saving} className="ml-auto">
          {saving && <Spinner className="mr-1" />}
          <SaveIcon className="size-4 mr-1" />
          Save
        </Button>
      </div>

      {!canEdit && (
        <Alert>
          <FolderKanbanIcon className="size-4" />
          <AlertTitle>Corporate plan required</AlertTitle>
          <AlertDescription>Project editing is available only for Corporate organizations.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl">Cover image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
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
