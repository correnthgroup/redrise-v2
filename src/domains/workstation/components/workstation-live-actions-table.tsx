import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WorkstationLiveAction } from "@/domains/workstation/types/workstation.types"

const statusVariant: Record<WorkstationLiveAction["status"], "default" | "secondary" | "outline" | "destructive"> = {
  Queued: "secondary",
  Preparing: "outline",
  Executing: "default",
  Completed: "outline",
  Failed: "destructive",
}

export function WorkstationLiveActionsTable({ actions }: { actions: WorkstationLiveAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live actions</CardTitle>
        <CardDescription>Recent and in-progress execution activity. Realtime wiring comes later.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Process</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.process}</TableCell>
                <TableCell>{action.node}</TableCell>
                <TableCell>{action.stage}</TableCell>
                <TableCell>{action.reviewer}</TableCell>
                <TableCell><Badge variant={statusVariant[action.status]}>{action.status}</Badge></TableCell>
                <TableCell className="text-right text-muted-foreground">{action.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
