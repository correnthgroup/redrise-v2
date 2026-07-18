"use client"

import * as React from "react"
import { RefreshCcwIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { ActionDetailsDialog } from "@/domains/workstation/actions/components/action-details-dialog"
import { ActionsFilters, defaultActionFilters } from "@/domains/workstation/actions/components/actions-filters"
import { ActionsKanban } from "@/domains/workstation/actions/components/actions-kanban"
import { RunHistoryTable } from "@/domains/workstation/actions/components/run-history-table"
import {
  filterActions,
  filterProcessRuns,
} from "@/domains/workstation/core/selectors"
import type { ActionFilters, ActionNodeRun } from "@/domains/workstation/actions/types/action.types"

export function ActionsPage({ organizationSlug }: { organizationSlug: string }) {
  const { snapshot, runtime, can } = useWorkstation()
  const [filters, setFilters] = React.useState<ActionFilters>(defaultActionFilters)
  const [selectedAction, setSelectedAction] = React.useState<ActionNodeRun | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [lastUpdated, setLastUpdated] = React.useState("Just now")

  const filteredActions = React.useMemo(() => filterActions([...snapshot.nodeRuns], filters), [filters, snapshot.nodeRuns])
  const filteredRuns = React.useMemo(() => filterProcessRuns([...snapshot.processRuns], [...snapshot.nodeRuns], filters), [filters, snapshot.nodeRuns, snapshot.processRuns])

  const handleViewDetails = React.useCallback((action: ActionNodeRun) => {
    setSelectedAction(action)
    setDetailsOpen(true)
  }, [])

  function handleRefresh() {
    setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    toast.success("Actions refreshed.", {
      description: "The view is already subscribed to the in-memory runtime; this timestamp confirms the current snapshot.",
    })
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-ACTIONS</p>
          <h1 className="text-3xl font-semibold tracking-tight">Actions</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Monitor node execution, review results and inspect process runs in real time.
          </p>
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
        <Button type="button" variant="outline" onClick={handleRefresh}>
          <RefreshCcwIcon />
          Refresh
        </Button>
      </div>

      <ActionsFilters filters={filters} onFiltersChange={setFilters} spaces={snapshot.spaces} processes={snapshot.processes} />
      <ActionsKanban actions={filteredActions} onViewDetails={handleViewDetails} />
      <RunHistoryTable runs={filteredRuns} nodeRuns={filteredActions} organizationSlug={organizationSlug} onViewAction={handleViewDetails} />
      <ActionDetailsDialog action={selectedAction} open={detailsOpen} onOpenChange={setDetailsOpen} onRetry={async (action) => { if (!can("run.retry", action.spaceId)) return void toast.error("You do not have permission to retry this Run."); try { await runtime.retryNodeRun(action.id); toast.success("Retry started as a new auditable attempt."); setDetailsOpen(false) } catch (error) { toast.error(error instanceof Error ? error.message : "Could not retry Run.") } }} />
    </section>
  )
}
