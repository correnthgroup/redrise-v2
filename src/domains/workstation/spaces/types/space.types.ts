export const spaceRoles = ["Admin", "Owner", "Board", "Staff", "User", "Viewer"] as const

export type SpaceRole = (typeof spaceRoles)[number]

export type OrganizationRole = SpaceRole

export type OrganizationMemberStatus = "accepted" | "pending" | "declined"

export type OrganizationMember = {
  id: string
  name: string
  email: string
  organizationRole: OrganizationRole
  status: OrganizationMemberStatus
}

export type SpaceMember = {
  id: string
  memberId: string
  name: string
  email: string
  spaceRole: SpaceRole
  organizationRole: OrganizationRole
  status: "Active"
}

export type Space = {
  id: string
  organizationId?: string
  name: string
  description: string
  membersCount: number
  rolesSummary: string
  processesCount: number
  actionsCount: number
  lastActivity: string
  status: "Active" | "Draft" | "Archived"
  members: SpaceMember[]
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export type SpaceUsageCard = {
  label: string
  value: number
  limit?: number
  helper: string
}

export type SpaceMetric = {
  label: string
  value: string
  helper: string
}
