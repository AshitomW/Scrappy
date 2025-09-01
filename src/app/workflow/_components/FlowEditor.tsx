"use client";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/tasks";
import { Workflows } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";

interface Props {
  workflow: Workflows;
}

const flowGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2,
};

const nodeTypes = {
  FlowNode: NodeComponent,
};

export default function FlowEditor({ workflow }: Props) {
  const [nodes, setNodes, onNodeChange] = useNodesState([
    CreateFlowNode(TaskType.LAUNCH_BROWSER),
  ]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodeChange}
        nodeTypes={nodeTypes}
        snapGrid={flowGrid}
        fitViewOptions={fitViewOptions}
        snapToGrid
        fitView
      >
        <Controls
          position="top-left"
          fitViewOptions={fitViewOptions}
          className="dark:text-black"
        />
        <Background variant={BackgroundVariant.Dots} gap={40} size={2} />
      </ReactFlow>
    </main>
  );
}
