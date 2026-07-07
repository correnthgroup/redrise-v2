import {
  getWorkstationShortcuts,
  workstationLiveActions,
  workstationOperationalSummary,
  workstationOrganizationSummary,
  workstationUsageData,
} from "@/domains/workstation/data/mock-workstation"
import { WorkstationLiveActionsTable } from "@/domains/workstation/components/workstation-live-actions-table"
import { WorkstationShortcuts } from "@/domains/workstation/components/workstation-shortcuts"
import { WorkstationSummaryCards } from "@/domains/workstation/components/workstation-summary-cards"
import { WorkstationUsageChart } from "@/domains/workstation/components/workstation-usage-chart"

export function WorkstationOverview({ organizationSlug }: { organizationSlug: string }) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-ROOT</p>
        <h1 className="text-3xl font-semibold tracking-tight">Workstation</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Configure, build, activate, execute and observe operational work across Spaces, Process and Actions.
        </p>
      </div>
      <WorkstationShortcuts shortcuts={getWorkstationShortcuts(organizationSlug)} />
      <WorkstationSummaryCards title="Operational summary" cards={workstationOperationalSummary} />
      <WorkstationSummaryCards title="Organization summary" cards={workstationOrganizationSummary} />
      <WorkstationUsageChart data={workstationUsageData} />
      <WorkstationLiveActionsTable actions={workstationLiveActions} />
    </section>
  )
}
