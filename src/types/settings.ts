export type SettingsRole = "Admin" | "Owner" | "Board" | "User" | "Viewer"

export type SettingsMemberStatus = "Active" | "Invited" | "Suspended"

export type SettingsMember = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  role: SettingsRole
  status: SettingsMemberStatus
  joinedAt?: string | null
}

export type OrganizationMemberRow = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  globalRole: SettingsRole
  workspaceRoles: Array<{
    workspaceId: string
    workspaceName: string
    role: SettingsRole
  }>
  processes: Array<{
    processId: string
    processName: string
  }>
  teams: string[]
  status: SettingsMemberStatus
  lastActivityAt?: string | null
}

export type NotificationSettings = {
  email: boolean
  inApp: boolean
  teamUpdates: boolean
  workspaceUpdates: boolean
  processUpdates: boolean
  actionUpdates: boolean
  productUpdates: boolean
}

export type SettingsIntegration = {
  id: string
  provider: string
  category: "communication" | "storage" | "automation" | "ai" | "analytics" | "other"
  status: "Connected" | "Disconnected" | "Error"
  connectedBy?: string | null
  connectedAt?: string | null
  lastSyncAt?: string | null
}
