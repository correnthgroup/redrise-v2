import { describe, expect, it } from "vitest"

import { FixtureAuthorizationPolicy, InMemoryWorkstationAdapter } from "@/domains/workstation/core/workstation"

const flush = async () => {
  for (let index = 0; index < 20; index += 1) await Promise.resolve()
}

function adapter() {
  let sequence = 0
  return new InMemoryWorkstationAdapter({
    organizationId: "org-test",
    idFactory: () => "test-" + String(++sequence).padStart(3, "0"),
    now: () => new Date("2026-07-18T12:00:00.000Z"),
    delay: async () => undefined,
  })
}

describe("FixtureAuthorizationPolicy", () => {
  it("applies organization roles and assigned Space scope", () => {
    const staff = new FixtureAuthorizationPolicy("Staff", new Set(["space-a"]))
    expect(staff.can("process.manage", "space-a")).toBe(true)
    expect(staff.can("process.manage", "space-b")).toBe(false)
    expect(staff.can("space.members.manage", "space-a")).toBe(false)

    const viewer = new FixtureAuthorizationPolicy("Viewer", new Set(["space-a"]))
    expect(viewer.can("space.read", "space-a")).toBe(true)
    expect(viewer.can("process.run", "space-a")).toBe(false)

    const admin = new FixtureAuthorizationPolicy("Admin", new Set())
    expect(admin.can("run.retry", "any-space")).toBe(true)
  })
})

describe("InMemoryWorkstationAdapter", () => {
  it("implements Space, member, Process, Node and connection CRUD in one snapshot", async () => {
    const store = adapter()
    const member = store.getSnapshot().members.find((item) => item.status === "accepted")!
    const space = await store.createSpace({ name: "Test Space", description: "Operational test boundary", members: [] })
    await store.addSpaceMember(space.id, { memberId: member.id, role: "Staff" })
    await store.updateSpace(space.id, { name: "Updated Space", description: "Updated operational boundary" })

    const process = await store.createProcess({
      spaceId: space.id,
      name: "Test Process",
      description: "End to end deterministic Process",
      frequency: "manual",
      owner: member.name,
      initialNodeType: "llm",
    })
    await store.updateProcess(process.id, { name: "Updated Process", description: process.description, owner: process.owner, frequency: process.frequency })
    const first = store.getSnapshot().nodes.find((node) => node.processId === process.id)!
    const second = await store.createNode(process.id)
    await store.updateNode(first.id, { position: { x: 400, y: 220 }, instruction: "Updated instruction" })
    await store.connectNodes({ processId: process.id, sourceNodeId: first.id, targetNodeId: second.id, connectionType: "success" })
    const duplicate = await store.duplicateNode(second.id)
    await store.deleteNode(duplicate.id)

    const snapshot = store.getSnapshot()
    expect(snapshot.spaces.find((item) => item.id === space.id)).toMatchObject({ name: "Updated Space", membersCount: 1 })
    expect(snapshot.processes.find((item) => item.id === process.id)).toMatchObject({ name: "Updated Process", nodesCount: 2 })
    expect(snapshot.nodes.find((item) => item.id === first.id)?.position).toEqual({ x: 400, y: 220 })
    expect(snapshot.connections).toContainEqual(expect.objectContaining({ sourceNodeId: first.id, targetNodeId: second.id }))
  })

  it("executes deterministic stages and keeps retry attempts auditable", async () => {
    const store = adapter()
    const snapshot = store.getSnapshot()
    const process = snapshot.processes.find((item) => item.status === "active") ?? snapshot.processes[0]!
    const node = snapshot.nodes.find((item) => item.processId === process.id)!
    await store.updateNode(node.id, { config: { ...node.config, simulateFailure: true }, failureBehavior: "stop_process" })

    const run = await store.startProcess(process.id, "Unit Test")
    await flush()

    const failed = store.getSnapshot().nodeRuns.find((item) => item.processRunId === run.id && item.nodeId === node.id)!
    expect(failed.status).toBe("failed")
    expect(store.getSnapshot().processRuns.find((item) => item.id === run.id)?.status).toBe("failed")

    const retry = await store.retryNodeRun(failed.id)
    await flush()

    const final = store.getSnapshot()
    expect(final.nodeRuns.find((item) => item.id === failed.id)?.status).toBe("failed")
    expect(final.nodeRuns.find((item) => item.id === retry.id)).toMatchObject({
      status: "completed",
      attempt: 2,
      retriedFromNodeRunId: failed.id,
    })
    expect(final.processRuns.find((item) => item.id === run.id)?.status).toBe("completed")
  })

  it("rejects invalid runtime transitions", async () => {
    const store = adapter()
    const process = store.getSnapshot().processes[0]!
    await store.setProcessStatus(process.id, "paused")
    await expect(store.startProcess(process.id)).rejects.toMatchObject({ code: "invalid_transition" })
  })
})