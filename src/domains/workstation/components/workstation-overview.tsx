"use client"

import { Layers3Icon, RouteIcon, ZapIcon } from "lucide-react"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { WorkstationLiveActionsTable } from "@/domains/workstation/components/workstation-live-actions-table"
import { WorkstationShortcuts } from "@/domains/workstation/components/workstation-shortcuts"
import { WorkstationSummaryCards } from "@/domains/workstation/components/workstation-summary-cards"
import { WorkstationUsageChart } from "@/domains/workstation/components/workstation-usage-chart"
import type { WorkstationLiveAction, WorkstationSummaryCard, WorkstationUsagePoint } from "@/domains/workstation/types/workstation.types"

export function WorkstationOverview({ organizationSlug }: { organizationSlug: string }) {
  const { snapshot } = useWorkstation()
  const base = "/" + organizationSlug + "/workstation"
  const completed = snapshot.nodeRuns.filter((run) => run.status === "completed").length
  const failed = snapshot.nodeRuns.filter((run) => run.status === "failed").length
  const activeMembers = snapshot.members.filter((member) => member.status === "accepted").length
  const assignedMembers = new Set(snapshot.spaces.flatMap((space) => space.members.map((member) => member.memberId))).size

  const shortcuts = [
    { title: "Spaces", description: "Manage workspaces, members and operational boundaries.", href: base + "/spaces", icon: <Layers3Icon className="size-5" />, metric: snapshot.spaces.length + " total" },
    { title: "Process", description: "Design flows, nodes and activation rules.", href: base + "/process", icon: <RouteIcon className="size-5" />, metric: snapshot.processes.length + " total" },
    { title: "Actions", description: "Track deterministic runtime stages and results.", href: base + "/actions", icon: <ZapIcon className="size-5" />, metric: snapshot.nodeRuns.length + " runs" },
  ]
  const operational: WorkstationSummaryCard[] = [
    { label: "Spaces", value: String(snapshot.spaces.length), helper: "Session-backed operational boundaries", tone: "success" },
    { label: "Processes", value: String(snapshot.processes.length), helper: "Draft, active, paused and archived", tone: "default" },
    { label: "Completed Actions", value: String(completed), helper: "Derived from actual Node Runs", tone: "success" },
    { label: "Failed Actions", value: String(failed), helper: "Eligible failures can be retried", tone: failed ? "warning" : "default" },
  ]
  const organization: WorkstationSummaryCard[] = [
    { label: "Active people", value: String(activeMembers), helper: "Accepted organization members", tone: "success" },
    { label: "Assigned people", value: String(assignedMembers), helper: "Members with at least one Space Role", tone: "default" },
    { label: "Pending invites", value: String(snapshot.members.filter((member) => member.status === "pending").length), helper: "Not assignable until accepted", tone: "warning" },
    { label: "Unassigned people", value: String(Math.max(0, activeMembers - assignedMembers)), helper: "Available for Space assignment", tone: "warning" },
  ]
  const usage: WorkstationUsagePoint[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const day = date.toISOString().slice(0, 10)
    const runs = snapshot.nodeRuns.filter((run) => run.startedAt?.startsWith(day))
    return { date: day, tokens: runs.length * 100, cost: 0, prompts: runs.length }
  })
  const liveActions: WorkstationLiveAction[] = snapshot.nodeRuns.slice(0, 8).map((run) => ({
    id: run.id,
    process: run.processName,
    node: run.nodeTitle,
    stage: run.stage === "plan" ? "Plan" : run.stage === "prepare" ? "Prepare" : run.stage === "execute" ? "Execute" : "Result",
    reviewer: run.triggeredBy,
    status: run.status === "failed" ? "Failed" : run.status === "completed" ? "Completed" : run.status === "executing" ? "Executing" : run.status === "preparing" ? "Preparing" : "Queued",
    updatedAt: run.completedAt ?? run.startedAt ?? "Queued",
  }))

  return (
    <section className="grid gap-6">
      <div className="grid gap-2"><p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-ROOT</p><h1 className="text-3xl font-semibold tracking-tight">Workstation</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Configure, build, activate, execute and observe operational work across Spaces, Process and Actions.</p></div>
      <WorkstationShortcuts shortcuts={shortcuts} />
      <WorkstationSummaryCards title="Operational summary" cards={operational} />
      <WorkstationSummaryCards title="Organization summary" cards={organization} />
      <WorkstationUsageChart data={usage} />
      <WorkstationLiveActionsTable actions={liveActions} />
    </section>
  )
}