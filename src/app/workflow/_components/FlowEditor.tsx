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
import { useCallback, useEffect } from "react";
import { toast, useSonner } from "sonner";
import { FlowNode } from "@/types/appnode";

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
  const [nodes, setNodes, onNodeChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();
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

  const onDragOver = useCallback(function (e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(function (e: React.DragEvent) {
    e.preventDefault();
    const taskType = e.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const dropPosition = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const newNode = CreateFlowNode(taskType as TaskType, dropPosition);
    setNodes((nodes) => nodes.concat(newNode));
  }, []);

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
        onDragOver={onDragOver}
        onDrop={onDrop}
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
