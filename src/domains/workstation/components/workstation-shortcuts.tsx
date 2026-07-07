import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkstationShortcut } from "@/domains/workstation/types/workstation.types"

export function WorkstationShortcuts({ shortcuts }: { shortcuts: WorkstationShortcut[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {shortcuts.map((shortcut) => (
        <Link key={shortcut.title} href={shortcut.href} className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Card className="h-full transition-colors group-hover:bg-muted/40">
            <CardHeader className="flex-row items-start justify-between space-y-0 gap-4">
              <div className="grid gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {shortcut.icon}
                </div>
                <CardTitle className="text-lg">{shortcut.title}</CardTitle>
              </div>
              <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm leading-6 text-muted-foreground">{shortcut.description}</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{shortcut.metric}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
