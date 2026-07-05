import { supabase } from './supabase'
import type { BillingPlan } from './billing'

export type PlanLimits = {
  workspaces: number
  flowsPerWorkspace: number
  tasksPerFlow: number
  agents: number
}

export const PLAN_LIMITS: Record<BillingPlan, PlanLimits> = {
  free: { workspaces: 2, flowsPerWorkspace: 3, tasksPerFlow: 7, agents: 3 },
  corporate: { workspaces: 11, flowsPerWorkspace: 7, tasksPerFlow: 15, agents: 11 },
}

export type UsageCounts = {
  workspaces: { used: number; limit: number }
  agents: { used: number; limit: number }
  flowsPerWorkspace: { workspaceId: string; workspaceName: string; used: number; limit: number }[]
  tasksPerFlow: { flowId: string; flowName: string; used: number; limit: number }[]
}

export async function loadUsageData(ownerUserId: string, plan: BillingPlan): Promise<UsageCounts> {
  const limits = PLAN_LIMITS[plan]

  const [workspaceCount, agentCount] = await Promise.all([
    supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', ownerUserId),
    supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('owner_user_id', ownerUserId),
  ])

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('user_id', ownerUserId)
    .order('created_at', { ascending: false })

  const flowsPerWorkspace: UsageCounts['flowsPerWorkspace'] = []
  const tasksPerFlow: UsageCounts['tasksPerFlow'] = []

  if (workspaces && workspaces.length > 0) {
    const workspaceIds = workspaces.map((w) => w.id)

    const { data: flows } = await supabase
      .from('flows')
      .select('id, name, workspace_id')
      .in('workspace_id', workspaceIds)

    const workspaceFlowCounts = new Map<string, { name: string; count: number }>()
    for (const ws of workspaces) {
      workspaceFlowCounts.set(ws.id, { name: ws.name, count: 0 })
    }
    if (flows) {
      for (const flow of flows) {
        const entry = workspaceFlowCounts.get(flow.workspace_id)
        if (entry) entry.count++
      }
    }
    for (const [wsId, { name, count }] of workspaceFlowCounts) {
      flowsPerWorkspace.push({ workspaceId: wsId, workspaceName: name, used: count, limit: limits.flowsPerWorkspace })
    }

    if (flows && flows.length > 0) {
      const flowIds = flows.map((f) => f.id)
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, flow_id')
        .in('flow_id', flowIds)

      const flowTaskCounts = new Map<string, { name: string; count: number }>()
      for (const flow of flows) {
        flowTaskCounts.set(flow.id, { name: flow.name, count: 0 })
      }
      if (tasks) {
        for (const task of tasks) {
          const entry = flowTaskCounts.get(task.flow_id)
          if (entry) entry.count++
        }
      }
      for (const [fId, { name, count }] of flowTaskCounts) {
        tasksPerFlow.push({ flowId: fId, flowName: name, used: count, limit: limits.tasksPerFlow })
      }
    }
  }

  return {
    workspaces: { used: workspaceCount.count ?? 0, limit: limits.workspaces },
    agents: { used: agentCount.count ?? 0, limit: limits.agents },
    flowsPerWorkspace,
    tasksPerFlow,
  }
}
