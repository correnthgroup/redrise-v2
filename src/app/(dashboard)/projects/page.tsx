"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon, FileTextIcon, FolderKanbanIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { ItemGroup, ItemHeader } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useI18n } from "@/hooks/use-i18n"
import { useProjects } from "@/hooks/use-projects"
import { effectiveBillingPlan, loadBillingSubscription, type BillingPlan } from "@/lib/billing"
import { supabase } from "@/lib/supabase"
import { loadSettingsAdminContext } from "@/lib/team-members"
import type { Project } from "@/types/project"

function ProjectCover({ project }: { project: Project }) {
  return (
    <ItemHeader className="aspect-[3/2] bg-muted flex items-center justify-center overflow-hidden">
      {project.image_url ? (
        <img src={project.image_url} alt={project.name} className="h-full w-full object-cover" />
      ) : (
        <FolderKanbanIcon className="h-8 w-8 text-muted-foreground/50" />
      )}
    </ItemHeader>
  )
}

function DeleteProjectDialog({ project, onDelete }: { project: Project; onDelete: (id: string) => Promise<void> }) {
  const [open, setOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)
  const canDelete = confirmText === "DELETE"

  const handleDelete = async () => {
    if (!canDelete) return
    try {
      setDeleting(true)
      await onDelete(project.id)
      setOpen(false)
      setConfirmText("")
      toast.success("Project deleted")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Project could not be deleted")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Delete project">
        <TrashIcon className="size-4 text-destructive" />
      </Button>
      <Dialog open={open} onOpenChange={(value) => { setOpen(value); setConfirmText("") }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Type <strong>DELETE</strong> to permanently delete &quot;{project.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-delete">Confirmation</Label>
            <Input
              id="confirm-delete"
              placeholder='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={!canDelete || deleting} onClick={handleDelete}>
              {deleting && <Spinner className="mr-1" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ProjectCard({ project, canManage, onDelete }: { project: Project; canManage: boolean; onDelete: (id: string) => Promise<void> }) {
  return (
    <Card className="overflow-hidden">
      <ProjectCover project={project} />
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">{project.name}</h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description || "No description provided."}</p>
          </div>
          <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}/resume`}>
              <FileTextIcon className="size-4 mr-1" />
              Resume
            </Link>
          </Button>
          {canManage && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${project.id}/edit`}>
                <PencilIcon className="size-4 mr-1" />
                Edit
              </Link>
            </Button>
          )}
          {canManage && <DeleteProjectDialog project={project} onDelete={onDelete} />}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [ownerUserId, setOwnerUserId] = React.useState<string>()
  const [plan, setPlan] = React.useState<BillingPlan>("free")
  const [contextLoading, setContextLoading] = React.useState(true)
  const { projects, loading, removeProject } = useProjects(ownerUserId)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          if (!cancelled) setContextLoading(false)
          return
        }
        const context = await loadSettingsAdminContext(session.user.id)
        const subscription = await loadBillingSubscription(context.ownerUserId)
        if (!cancelled) {
          setOwnerUserId(context.ownerUserId)
          setPlan(effectiveBillingPlan(subscription))
          setContextLoading(false)
        }
      } catch {
        if (!cancelled) setContextLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const canManageProjects = plan === "corporate"

  const handleDelete = async (id: string) => {
    await removeProject(id)
  }

  if (contextLoading || loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-64 w-full" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t("projects.header.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("projects.header.subtitle")}</p>
        </div>
        <Button disabled={!canManageProjects} onClick={() => router.push("/projects/new")}>
          <PlusIcon className="size-4 mr-1" />
          New Project
        </Button>
      </div>

      {!canManageProjects && (
        <Alert>
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Corporate plan required</AlertTitle>
          <AlertDescription>
            Projects are available for Corporate organizations. Upgrade in Billing to create and manage projects.
          </AlertDescription>
        </Alert>
      )}

      {projects.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <FolderKanbanIcon className="size-8 text-muted-foreground" />
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>Use projects to group spaces, processes, actions, agents, and operating context.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {canManageProjects ? (
              <Button onClick={() => router.push("/projects/new")}>Create Project</Button>
            ) : (
              <Button asChild variant="outline"><Link href="/settings/billing">View Billing</Link></Button>
            )}
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} canManage={canManageProjects} onDelete={handleDelete} />
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
