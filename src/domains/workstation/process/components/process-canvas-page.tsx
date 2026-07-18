"use client"

import * as React from "react"
import Link from "next/link"
import { Background, Controls, Handle, MiniMap, Position, ReactFlow, type Connection, type Edge, type Node, type NodeProps, useEdgesState, useNodesState } from "@xyflow/react"
import { CopyPlusIcon, PlayIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkstation } from "@/domains/workstation/core/workstation-provider"
import { ProcessCanvasToolbar } from "@/domains/workstation/process/components/process-canvas-toolbar"
import { ProcessNodeConfigDialog } from "@/domains/workstation/process/components/process-node-config-dialog"
import type { RedRiseNode } from "@/domains/workstation/process/types/process.types"

type CanvasNodeData = { node: RedRiseNode; run?: { status: string } }
type RedRiseFlowNode = Node<CanvasNodeData, "redriseNode">

function RedRiseCanvasNode({ data, selected }: NodeProps<RedRiseFlowNode>) {
  const runStatus = data.run?.status ?? (data.node.enabled ? "queued" : "skipped")
  const preview = data.node.instruction.length > 92 ? data.node.instruction.slice(0, 92) + "..." : data.node.instruction
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="size-3 border-background bg-primary" />
      <Card className={"w-72 shadow-sm " + (selected ? "ring-2 ring-primary" : "")}>
        <CardHeader className="gap-2 pb-3"><Badge variant="outline" className="w-fit">{data.node.nodeType}</Badge><CardTitle className="text-base">{data.node.title}</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-xs">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><Badge variant={runStatus === "failed" ? "destructive" : runStatus === "completed" ? "outline" : "secondary"}>{runStatus}</Badge></div>
          <p className="leading-5 text-muted-foreground">{preview}</p>
          <div className="flex justify-between text-muted-foreground"><span>Input: {data.node.inputMode}</span><span>Output: {data.node.outputType}</span></div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Right} className="size-3 border-background bg-primary" />
    </div>
  )
}

const nodeTypes = { redriseNode: RedRiseCanvasNode }

export function ProcessCanvasPage({ organizationSlug, processId }: { organizationSlug: string; processId: string }) {
  const { repository, runtime, snapshot, can } = useWorkstation()
  const process = snapshot.processes.find((item) => item.id === processId)
  const [nodes, setNodes, onNodesChange] = useNodesState<RedRiseFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [menuOpen, setMenuOpen] = React.useState(true)
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)
  const [configOpen, setConfigOpen] = React.useState(false)

  React.useEffect(() => {
    const processNodes = snapshot.nodes.filter((node) => node.processId === processId)
    const latestRuns = snapshot.nodeRuns.filter((run) => run.processId === processId)
    setNodes(processNodes.map((node) => ({
      id: node.id,
      type: "redriseNode",
      position: node.position,
      data: { node, run: latestRuns.find((run) => run.nodeId === node.id) },
    })))
    setEdges(snapshot.connections.filter((edge) => edge.processId === processId).map((edge) => ({ id: edge.id, source: edge.sourceNodeId, target: edge.targetNodeId, label: edge.connectionType })))
  }, [processId, setEdges, setNodes, snapshot.connections, snapshot.nodeRuns, snapshot.nodes])

  const selectedNode = snapshot.nodes.find((node) => node.id === selectedNodeId) ?? null

  if (!process) return <section className="grid gap-4"><h1 className="text-2xl font-semibold">Process not found</h1><Button asChild variant="outline"><Link href={"/" + organizationSlug + "/workstation/process"}>Back to Process</Link></Button></section>

  const activeProcess = process

  async function handleNewNode() {
    if (!can("process.manage", activeProcess.spaceId)) return void toast.error("You do not have permission to edit this Process.")
    const node = await repository.createNode(activeProcess.id)
    setSelectedNodeId(node.id)
    toast.success("Node created.")
  }

  async function handleDeleteNode() {
    if (!selectedNodeId) return void toast("Select a node before deleting.")
    if (!can("process.manage", activeProcess.spaceId)) return void toast.error("You do not have permission to edit this Process.")
    await repository.deleteNode(selectedNodeId)
    setSelectedNodeId(null)
    toast.success("Node deleted.")
  }

  async function handleDuplicateNode() {
    if (!selectedNodeId) return void toast("Select a node before duplicating.")
    if (!can("process.manage", activeProcess.spaceId)) return void toast.error("You do not have permission to edit this Process.")
    const duplicate = await repository.duplicateNode(selectedNodeId)
    setSelectedNodeId(duplicate.id)
    toast.success("Node duplicated.")
  }

  function handleEditNode() {
    if (!selectedNode) return void toast("Select a node before editing.")
    setConfigOpen(true)
  }

  async function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return
    if (!can("process.manage", activeProcess.spaceId)) return void toast.error("You do not have permission to connect Nodes.")
    try {
      await repository.connectNodes({ processId: activeProcess.id, sourceNodeId: connection.source, targetNodeId: connection.target, connectionType: "success" })
      toast.success("Nodes connected.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not connect Nodes.")
    }
  }

  async function handleRun() {
    if (!can("process.run", activeProcess.spaceId)) return void toast.error("You do not have permission to run this Process.")
    try {
      await runtime.startProcess(activeProcess.id)
      toast.success("Process Run started. Open Actions to follow each stage.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start Process.")
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-2"><p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">WS-PROCESS-CANVAS</p><h1 className="text-3xl font-semibold tracking-tight">{activeProcess.name} Canvas</h1><p className="text-sm text-muted-foreground">Design, configure and execute the Process using the session-backed adapter.</p></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild><Link href={"/" + organizationSlug + "/workstation/process"}>Back</Link></Button>
          {can("process.manage", activeProcess.spaceId) ? <Button variant="outline" onClick={() => void handleDuplicateNode()}><CopyPlusIcon />Duplicate</Button> : null}
          {can("process.run", activeProcess.spaceId) ? <Button variant="outline" onClick={() => void handleRun()}><PlayIcon />Run</Button> : null}
          {can("process.manage", activeProcess.spaceId) ? <Button onClick={() => void handleNewNode()}><PlusIcon />New Node</Button> : null}
        </div>
      </div>
      <div className="relative h-[680px] overflow-hidden rounded-xl border bg-muted/20">
        <ProcessCanvasToolbar open={menuOpen} onOpenChange={setMenuOpen} onNewNode={() => void handleNewNode()} onDeleteNode={() => void handleDeleteNode()} onEditNode={handleEditNode} onSelectAll={() => setNodes((current) => current.map((node) => ({ ...node, selected: true })))} />
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={(connection) => void handleConnect(connection)} onNodeClick={(_, node) => setSelectedNodeId(node.id)} onSelectionChange={({ nodes: selected }) => setSelectedNodeId(selected[0]?.id ?? null)} onNodeDragStop={(_, node) => void repository.updateNode(node.id, { position: node.position })} fitView>
          <Background /><Controls /><MiniMap pannable zoomable />
        </ReactFlow>
      </div>
      <ProcessNodeConfigDialog node={selectedNode} open={configOpen} onOpenChange={setConfigOpen} onSave={(id, patch) => repository.updateNode(id, patch).then(() => undefined)} />
    </section>
  )
}