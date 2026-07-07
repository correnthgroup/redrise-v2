import { Card, CardContent } from "@/components/ui/card"
import type { SpaceMetric } from "@/domains/workstation/spaces/types/space.types"

export function SpacesMetricsStrip({ metrics }: { metrics: SpaceMetric[] }) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="grid gap-1 rounded-lg bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.helper}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
