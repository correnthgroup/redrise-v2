"use client"

import * as React from "react"

import {
  FixtureAuthorizationPolicy,
  InMemoryWorkstationAdapter,
  type AuthorizationPolicy,
  type ExecutionRuntime,
  type WorkstationCapability,
  type WorkstationRepository,
  type WorkstationSnapshot,
} from "@/domains/workstation/core/workstation"

interface WorkstationContextValue {
  repository: WorkstationRepository
  runtime: ExecutionRuntime
  authorization: AuthorizationPolicy
  snapshot: WorkstationSnapshot
  can(capability: WorkstationCapability, spaceId?: string): boolean
}

const WorkstationContext = React.createContext<WorkstationContextValue | null>(null)

export function WorkstationProvider({ children, organizationSlug }: { children: React.ReactNode; organizationSlug: string }) {
  const [adapter] = React.useState(() => new InMemoryWorkstationAdapter({ organizationId: organizationSlug }))
  const snapshot = React.useSyncExternalStore(adapter.subscribe.bind(adapter), adapter.getSnapshot.bind(adapter), adapter.getSnapshot.bind(adapter))
  const assignedSpaces = React.useMemo(() => new Set(snapshot.spaces.filter((space) => space.members.some((member) => member.memberId === snapshot.currentUser.id)).map((space) => space.id)), [snapshot])
  const authorization = React.useMemo(() => new FixtureAuthorizationPolicy(snapshot.currentUser.organizationRole, assignedSpaces), [snapshot.currentUser.organizationRole, assignedSpaces])
  const value = React.useMemo<WorkstationContextValue>(() => ({ repository: adapter, runtime: adapter, authorization, snapshot, can: authorization.can.bind(authorization) }), [adapter, authorization, snapshot])
  return <WorkstationContext.Provider value={value}>{children}</WorkstationContext.Provider>
}

export function useWorkstation() {
  const context = React.useContext(WorkstationContext)
  if (!context) throw new Error("useWorkstation must be used within WorkstationProvider")
  return context
}