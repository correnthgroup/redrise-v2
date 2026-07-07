import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Space } from "@/domains/workstation/spaces/types/space.types"

export function SpaceMembersList({ space }: { space: Space }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{space.name} members</CardTitle>
        <CardDescription>Space Role is scoped to this Space and does not change Organization Role.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Space Role</TableHead>
              <TableHead>Organization Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {space.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell><Badge variant="outline">{member.spaceRole}</Badge></TableCell>
                <TableCell>{member.organizationRole}</TableCell>
                <TableCell><Badge variant="secondary">{member.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
