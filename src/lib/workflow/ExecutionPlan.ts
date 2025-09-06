import { FlowNode } from "@/types/appnode";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRepository } from "./tasks/Repository";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FlowToExecutionPlan(
  nodes: FlowNode[],
  edges: Edge
): FlowToExecutionPlanType {
  // find the entry point;

  const entryPoint = nodes.find(
    (node) => TaskRepository[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("Not a valid entry point!------TODO-----");
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (const node in nodes) {
    const visited = new
  }

  return { executionPlan };
}
