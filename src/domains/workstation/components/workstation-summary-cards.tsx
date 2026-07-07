import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { WorkstationSummaryCard } from "@/domains/workstation/types/workstation.types"

const toneClass: Record<WorkstationSummaryCard["tone"], string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
}

export function WorkstationSummaryCards({ title, cards }: { title: string; cards: WorkstationSummaryCard[] }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-gradient-to-t from-primary/5 to-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <Badge variant="outline" className={cn("border-transparent", toneClass[card.tone])}>
                  {card.tone}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
