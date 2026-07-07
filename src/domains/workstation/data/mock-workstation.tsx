import { ActivityIcon, Layers3Icon, RouteIcon, ZapIcon } from "lucide-react"

import type {
  WorkstationLiveAction,
  WorkstationShortcut,
  WorkstationSummaryCard,
  WorkstationUsagePoint,
} from "@/domains/workstation/types/workstation.types"

export function getWorkstationShortcuts(organizationSlug: string): WorkstationShortcut[] {
  const base = `/${organizationSlug}/workstation`

  return [
    {
      title: "Spaces",
      description: "Manage workspaces, members and operational boundaries.",
      href: `${base}/spaces`,
      icon: <Layers3Icon className="size-5" />,
      metric: "4 active",
    },
    {
      title: "Process",
      description: "Design flows and activation rules when Process PRDs begin.",
      href: `${base}/process`,
      icon: <RouteIcon className="size-5" />,
      metric: "7 drafts",
    },
    {
      title: "Actions",
      description: "Track execution status, reviewers and results.",
      href: `${base}/actions`,
      icon: <ZapIcon className="size-5" />,
      metric: "12 today",
    },
  ]
}

export const workstationOperationalSummary: WorkstationSummaryCard[] = [
  { label: "Spaces created", value: "4", helper: "2 with active members", tone: "success" },
  { label: "People in Spaces", value: "18", helper: "6 roles assigned this week", tone: "default" },
  { label: "Processes drafted", value: "7", helper: "Process implementation is upcoming", tone: "warning" },
  { label: "Actions performed", value: "128", helper: "Mocked operational history", tone: "default" },
]

export const workstationOrganizationSummary: WorkstationSummaryCard[] = [
  { label: "Agents involved", value: "3", helper: "Default model included", tone: "default" },
  { label: "Active people", value: "12", helper: "Accepted members only", tone: "success" },
  { label: "Pending invites", value: "4", helper: "Shown in future notification rules", tone: "warning" },
  { label: "People without Space", value: "5", helper: "Ready for assignment", tone: "warning" },
]

export const workstationUsageData: WorkstationUsagePoint[] = [
  { date: "2026-07-01", tokens: 4200, cost: 9, prompts: 18 },
  { date: "2026-07-02", tokens: 6100, cost: 13, prompts: 25 },
  { date: "2026-07-03", tokens: 5800, cost: 12, prompts: 22 },
  { date: "2026-07-04", tokens: 7200, cost: 16, prompts: 31 },
  { date: "2026-07-05", tokens: 6700, cost: 14, prompts: 28 },
  { date: "2026-07-06", tokens: 8400, cost: 19, prompts: 36 },
  { date: "2026-07-07", tokens: 7600, cost: 17, prompts: 33 },
  { date: "2026-07-08", tokens: 9200, cost: 21, prompts: 42 },
  { date: "2026-07-09", tokens: 8800, cost: 20, prompts: 39 },
  { date: "2026-07-10", tokens: 10100, cost: 24, prompts: 45 },
  { date: "2026-07-11", tokens: 9700, cost: 22, prompts: 41 },
  { date: "2026-07-12", tokens: 11200, cost: 27, prompts: 52 },
]

export const workstationLiveActions: WorkstationLiveAction[] = [
  { id: "act-001", process: "Monthly Closing", node: "Validate invoices", stage: "Prepare", reviewer: "Ana Rivera", status: "Preparing", updatedAt: "2 min ago" },
  { id: "act-002", process: "Lead Intake", node: "Classify request", stage: "Execute", reviewer: "RedRise Agent", status: "Executing", updatedAt: "5 min ago" },
  { id: "act-003", process: "Support Triage", node: "Human approval", stage: "Plan", reviewer: "Marco Silva", status: "Queued", updatedAt: "12 min ago" },
  { id: "act-004", process: "Content Review", node: "Final summary", stage: "Result", reviewer: "Beatriz Costa", status: "Completed", updatedAt: "24 min ago" },
]

export const workstationHeaderIcon = <ActivityIcon className="size-4" />
