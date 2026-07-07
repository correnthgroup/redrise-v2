import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SpaceUsageCard } from "@/domains/workstation/spaces/types/space.types"

function getPercent(card: SpaceUsageCard) {
  if (!card.limit) return 100
  return Math.min(Math.round((card.value / card.limit) * 100), 100)
}

export function SpacesUsageCards({ cards }: { cards: SpaceUsageCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const percent = getPercent(card)
        return (
          <Card key={card.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
                {card.limit ? <p className="text-sm text-muted-foreground">of {card.limit}</p> : null}
              </div>
              <Progress value={percent} />
              <p className="text-sm text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
