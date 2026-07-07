import type { ReactNode } from "react"

export type WorkstationShortcut = {
  title: string
  description: string
  href: string
  icon: ReactNode
  metric: string
}

export type WorkstationSummaryCard = {
  label: string
  value: string
  helper: string
  tone: "default" | "success" | "warning"
}

export type WorkstationUsagePoint = {
  date: string
  tokens: number
  cost: number
  prompts: number
}

export type WorkstationLiveAction = {
  id: string
  process: string
  node: string
  stage: "Plan" | "Prepare" | "Execute" | "Result"
  reviewer: string
  status: "Queued" | "Preparing" | "Executing" | "Completed" | "Failed"
  updatedAt: string
}
