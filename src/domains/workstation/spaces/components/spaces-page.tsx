"use client"

import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { CreateSpaceDialog } from "@/domains/workstation/spaces/dialogs/create-space-dialog"
import { SpacesMetricsStrip } from "@/domains/workstation/spaces/components/spaces-metrics-strip"
import { SpacesTable } from "@/domains/workstation/spaces/components/spaces-table"
import { SpacesUsageCards } from "@/domains/workstation/spaces/components/spaces-usage-cards"

export function SpacesPage() {
  const { snapshot } = useWorkstation()
  const members = new Set(snapshot.spaces.flatMap((space) => space.members.map((member) => member.memberId))).size
  const active = snapshot.spaces.filter((space) => space.status === "Active").length
  const cards = [
    { label: "Spaces", value: snapshot.spaces.length, helper: "In-memory session total" },
    { label: "Members assigned", value: members, helper: "Unique organization members" },
    { label: "Processes", value: snapshot.processes.length, helper: "Across all Spaces" },
  ]
  const metrics = [
    { label: "Active Spaces", value: String(active), helper: "Available operational boundaries" },
    { label: "Archived Spaces", value: String(snapshot.spaces.filter((space) => space.status === "Archived").length), helper: "Retained for session audit" },
    { label: "Node Runs", value: String(snapshot.nodeRuns.length), helper: "Derived from runtime executions" },
  ]

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div className="grid gap-2"><p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-SPACES</p><h1 className="text-3xl font-semibold tracking-tight">Spaces</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Create and manage workspaces, members and operational boundaries.</p></div><CreateSpaceDialog /></div>
      <SpacesUsageCards cards={cards} />
      <SpacesMetricsStrip metrics={metrics} />
      <SpacesTable spaces={[...snapshot.spaces]} />
    </section>
  )
}