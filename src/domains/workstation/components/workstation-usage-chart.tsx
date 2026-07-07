"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { WorkstationUsagePoint } from "@/domains/workstation/types/workstation.types"

const chartConfig = {
  tokens: { label: "Tokens", color: "var(--primary)" },
  prompts: { label: "Prompts", color: "var(--chart-2)" },
} satisfies ChartConfig

type Range = "3d" | "7d" | "30d"

export function WorkstationUsageChart({ data }: { data: WorkstationUsagePoint[] }) {
  const [range, setRange] = React.useState<Range>("7d")
  const [toggleValue, setToggleValue] = React.useState<readonly string[]>(["7d"])
  const visibleData = data.slice(range === "3d" ? -3 : range === "7d" ? -7 : -30)

  function handleRangeChange(value: readonly string[]) {
    if (!value.length) return
    const selected = value[value.length - 1] as Range
    setRange(selected)
    setToggleValue([selected])
  }

  return (
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1.5">
          <CardTitle>Usage analytics</CardTitle>
          <CardDescription>Mocked token and prompt usage for the selected period.</CardDescription>
        </div>
        <ToggleGroup
          value={toggleValue}
          onValueChange={handleRangeChange}
          variant="outline"
          className="w-fit"
        >
          <ToggleGroupItem value="3d">3d</ToggleGroupItem>
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={visibleData} margin={{ left: 0, right: 12 }}>
            <defs>
              <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tokens)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-tokens)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillPrompts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-prompts)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--color-prompts)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={42} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="tokens" type="natural" fill="url(#fillTokens)" stroke="var(--color-tokens)" />
            <Area dataKey="prompts" type="natural" fill="url(#fillPrompts)" stroke="var(--color-prompts)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
