"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon, FolderKanbanIcon, PencilIcon, PrinterIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useI18n } from "@/hooks/use-i18n"
import { getProject } from "@/lib/projects"
import type { Project } from "@/types/project"

export default function ResumeProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useI18n()
  const id = params.id as string
  const [project, setProject] = React.useState<Project | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const data = await getProject(id)
        if (!cancelled) setProject(data)
      } catch {
        if (!cancelled) setProject(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="flex flex-col gap-4"><Skeleton className="h-10 w-56" /><Skeleton className="h-72 w-full" /></div>
  }

  if (!project) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <FolderKanbanIcon className="size-8 text-muted-foreground" />
          <EmptyTitle>{t("projects.resume.header.title")}</EmptyTitle>
          <EmptyDescription>Project not found or unavailable for this organization.</EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => router.push("/projects")}>Back to Projects</Button>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{t("projects.resume.header.subtitle")}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}/edit`}>
              <PencilIcon className="size-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon className="size-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="aspect-[3/2] bg-muted flex items-center justify-center overflow-hidden">
            {project.image_url ? <img src={project.image_url} alt={project.name} className="h-full w-full object-cover" /> : <FolderKanbanIcon className="h-10 w-10 text-muted-foreground/50" />}
          </div>
          <CardHeader><CardTitle className="text-base">Overview</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description || "No description provided."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <Badge>{project.status}</Badge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-xs">{project.id}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Created</span>
              <span>{new Intl.DateTimeFormat().format(new Date(project.created_at))}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Updated</span>
              <span>{new Intl.DateTimeFormat().format(new Date(project.updated_at))}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
