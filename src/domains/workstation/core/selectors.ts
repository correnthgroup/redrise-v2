import type { ActionFilters, ActionNodeRun, ActionStage, ProcessRun } from "@/domains/workstation/actions/types/action.types"

export function getActionStage(status: ActionNodeRun["status"]): ActionStage {
  if (status === "preparing") return "prepare"
  if (status === "executing") return "execute"
  if (["completed", "failed", "skipped", "cancelled"].includes(status)) return "result"
  return "plan"
}

function matchesDate(value: string | undefined, range: ActionFilters["dateRange"], now = new Date()) {
  if (range === "all") return true
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return false
  if (range === "today") return date.toDateString() === now.toDateString()
  return now.valueOf() - date.valueOf() <= 7 * 24 * 60 * 60 * 1000
}

export function filterActions(actions: readonly ActionNodeRun[], filters: ActionFilters) {
  const query = filters.search.trim().toLowerCase()
  return actions.filter((action) => {
    const values = [action.id, action.processRunId, action.nodeTitle, action.processName, action.spaceName, action.modelName, action.triggeredBy]
    return (filters.spaceId === "all" || action.spaceId === filters.spaceId)
      && (filters.processId === "all" || action.processId === filters.processId)
      && (filters.status === "all" || action.status === filters.status)
      && matchesDate(action.startedAt, filters.dateRange)
      && (!query || values.some((value) => value.toLowerCase().includes(query)))
  })
}

export function filterProcessRuns(runs: readonly ProcessRun[], actions: readonly ActionNodeRun[], filters: ActionFilters) {
  const visibleRunIds = new Set(filterActions(actions, filters).map((action) => action.processRunId))
  const query = filters.search.trim().toLowerCase()
  return runs.filter((run) => {
    const values = [run.id, run.processName, run.spaceName, run.triggeredBy]
    return (filters.spaceId === "all" || run.spaceId === filters.spaceId)
      && (filters.processId === "all" || run.processId === filters.processId)
      && (filters.status === "all" || run.status === filters.status || visibleRunIds.has(run.id))
      && matchesDate(run.startedAt, filters.dateRange)
      && (!query || visibleRunIds.has(run.id) || values.some((value) => value.toLowerCase().includes(query)))
  })
}