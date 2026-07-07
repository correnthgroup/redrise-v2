import { CreateSpaceDialog } from "@/domains/workstation/spaces/dialogs/create-space-dialog"
import { mockSpaces, spacesMetrics, spacesUsageCards } from "@/domains/workstation/spaces/data/mock-spaces"
import { SpacesMetricsStrip } from "@/domains/workstation/spaces/components/spaces-metrics-strip"
import { SpacesTable } from "@/domains/workstation/spaces/components/spaces-table"
import { SpacesUsageCards } from "@/domains/workstation/spaces/components/spaces-usage-cards"

export function SpacesPage() {
  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-SPACES</p>
          <h1 className="text-3xl font-semibold tracking-tight">Spaces</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Create and manage workspaces, members and operational boundaries.
          </p>
        </div>
        <CreateSpaceDialog />
      </div>
      <SpacesUsageCards cards={spacesUsageCards} />
      <SpacesMetricsStrip metrics={spacesMetrics} />
      <SpacesTable spaces={mockSpaces} />
    </section>
  )
}
