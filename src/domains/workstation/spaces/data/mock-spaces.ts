import type {
  OrganizationMember,
  Space,
  SpaceMetric,
  SpaceUsageCard,
} from "@/domains/workstation/spaces/types/space.types"

export const mockOrganizationMembers: OrganizationMember[] = [
  { id: "mem-001", name: "Ana Rivera", email: "ana@redrise.app", organizationRole: "Owner", status: "accepted" },
  { id: "mem-002", name: "Marco Silva", email: "marco@redrise.app", organizationRole: "Board", status: "accepted" },
  { id: "mem-003", name: "Beatriz Costa", email: "beatriz@redrise.app", organizationRole: "Staff", status: "accepted" },
  { id: "mem-004", name: "Nina Gomez", email: "nina@redrise.app", organizationRole: "User", status: "accepted" },
  { id: "mem-005", name: "Paulo Mendes", email: "paulo@redrise.app", organizationRole: "Viewer", status: "pending" },
]

export const acceptedOrganizationMembers = mockOrganizationMembers.filter((member) => member.status === "accepted")

export const mockSpaces: Space[] = [
  {
    id: "space-001",
    name: "Finance Operations",
    description: "Monthly closing, invoice checks and finance approvals.",
    membersCount: 6,
    rolesSummary: "Owner, Board, Staff",
    processesCount: 3,
    actionsCount: 48,
    lastActivity: "8 min ago",
    status: "Active",
    members: [
      { id: "sm-001", memberId: "mem-001", name: "Ana Rivera", email: "ana@redrise.app", spaceRole: "Owner", organizationRole: "Owner", status: "Active" },
      { id: "sm-002", memberId: "mem-002", name: "Marco Silva", email: "marco@redrise.app", spaceRole: "Board", organizationRole: "Board", status: "Active" },
      { id: "sm-003", memberId: "mem-003", name: "Beatriz Costa", email: "beatriz@redrise.app", spaceRole: "Staff", organizationRole: "Staff", status: "Active" },
    ],
  },
  {
    id: "space-002",
    name: "Customer Support",
    description: "Support triage, escalations and response quality checks.",
    membersCount: 8,
    rolesSummary: "Board, Staff, User",
    processesCount: 2,
    actionsCount: 64,
    lastActivity: "21 min ago",
    status: "Active",
    members: [
      { id: "sm-004", memberId: "mem-002", name: "Marco Silva", email: "marco@redrise.app", spaceRole: "Board", organizationRole: "Board", status: "Active" },
      { id: "sm-005", memberId: "mem-004", name: "Nina Gomez", email: "nina@redrise.app", spaceRole: "User", organizationRole: "User", status: "Active" },
    ],
  },
  {
    id: "space-003",
    name: "Growth Lab",
    description: "Campaign intake and structured content review workflows.",
    membersCount: 4,
    rolesSummary: "Staff, User, Viewer",
    processesCount: 2,
    actionsCount: 16,
    lastActivity: "1 hour ago",
    status: "Draft",
    members: [
      { id: "sm-006", memberId: "mem-003", name: "Beatriz Costa", email: "beatriz@redrise.app", spaceRole: "Staff", organizationRole: "Staff", status: "Active" },
    ],
  },
]

export const spacesUsageCards: SpaceUsageCard[] = [
  { label: "Spaces used", value: 3, limit: 7, helper: "Free plan limit" },
  { label: "Members in Spaces", value: 18, limit: 25, helper: "Accepted members assigned" },
  { label: "Processes linked", value: 7, limit: 30, helper: "Across active Spaces" },
  { label: "Actions generated", value: 128, helper: "Last 30 days" },
]

export const spacesMetrics: SpaceMetric[] = [
  { label: "Active Spaces", value: "2", helper: "1 draft space" },
  { label: "Members Assigned", value: "18", helper: "Accepted members only" },
  { label: "Members Without Space", value: "5", helper: "Ready to assign" },
  { label: "Active Processes in Spaces", value: "5", helper: "Mocked process count" },
]
