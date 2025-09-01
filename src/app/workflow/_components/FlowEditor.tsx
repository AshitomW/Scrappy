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
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";
import { useEffect } from "react";
import { toast, useSonner } from "sonner";

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
  const [nodes, setNodes, onNodeChange] = useNodesState([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();
  useEffect(
    function () {
      try {
        const flow = JSON.parse(workflow.definition);
        if (!flow) return;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);

        // -------- Set last used viewport , remove fitview from ReactFlow component to use this!!
        // if (!flow.viewport) return;

        // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        // setViewport({ x, y, zoom });
      } catch (err) {
        toast.error("Something went wrong", { id: "workflow" });
      }
    },
    [workflow.definition, setEdges, setNodes, setViewport]
  );

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
