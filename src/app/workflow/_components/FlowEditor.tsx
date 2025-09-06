"use client";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/tasks";
import { Workflows } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
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
import DeletableEdge from "./Edges/DeletableEdge";
import { Target } from "lucide-react";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";

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
const edgeTypes = {
  default: DeletableEdge,
};

export default function FlowEditor({ workflow }: Props) {
  const [nodes, setNodes, onNodeChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
      if (!connection.targetHandle) return;
      const node = nodes.find((nd) => nd.id === connection.target);
      if (!node) return;
      const nodeInputs = node?.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    function (connection: Edge | Connection) {
      // Disable Self Connections
      if (connection.source === connection.target) return false;

      // Same task parameter type

      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);

      if (!source || !target) {
        console.error("Invalid Connection: Source or Target Node Not Found");
        return false;
      }

      const sourceTask = TaskRepository[source.data.type];
      const targetTask = TaskRepository[target.data.type];

      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );

      const input = targetTask.inputs.find(
        (i) => i.name == connection.targetHandle
      );

      if (input?.type !== output?.type) {
        console.error("Invalid Connection");
        return false;
      }

      // Preventing Node Cyles

      const hasCycle = (node: FlowNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, edges]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={flowGrid}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
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
