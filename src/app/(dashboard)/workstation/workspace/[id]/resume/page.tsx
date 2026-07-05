"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon, LayoutGrid, PrinterIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Item, ItemHeader } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useWorkspaces } from "@/hooks/use-workspaces"

export default function ResumePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { workspaces, loading } = useWorkspaces()
  const workspace = workspaces.find((item) => item.id === params.id) ?? null

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
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon" onClick={() => router.push("/workstation/workspace")}>
                <ArrowLeftIcon className="size-4" />
              </Button>
            } />
            <TooltipContent><p>Go back</p></TooltipContent>
          </Tooltip>
          <div>
            <h1 className="text-lg font-semibold">Space not found</h1>
            <p className="text-sm text-muted-foreground">The workspace you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger render={
            <Button variant="ghost" size="icon" onClick={() => router.push("/workstation/workspace")}>
              <ArrowLeftIcon className="size-4" />
            </Button>
          } />
          <TooltipContent><p>Go back</p></TooltipContent>
        </Tooltip>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Resume</h1>
          <p className="text-sm text-muted-foreground">Space report for &quot;{workspace.name}&quot;</p>
        </div>
        <Tooltip>
          <TooltipTrigger render={
            <Button variant="outline" onClick={() => window.print()}>
              <PrinterIcon className="mr-1 size-4" />
              Print
            </Button>
          } />
          <TooltipContent><p>Print this report</p></TooltipContent>
        </Tooltip>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-6">
              <div className="w-48 shrink-0">
                <Item>
                  <ItemHeader className="flex aspect-[3/2] items-center justify-center overflow-hidden bg-muted">
                    <LayoutGrid className="size-10 text-muted-foreground/50" />
                  </ItemHeader>
                </Item>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-xl font-bold">{workspace.name}</h2>
                <div className="flex gap-4 text-sm">
                  <span>Flows: <Badge variant="secondary">{workspace.flows}</Badge></span>
                  <span>Status: <Badge variant="outline">{workspace.status}</Badge></span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Mission / Playbook</h3>
              {workspace.mission ? (
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{workspace.mission}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No mission provided.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
