"use server";

import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/ExecuteWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import {
  ExecutionPhaseStatus,
  ExecutionStatus,
  ExecutionTrigger,
  WorkflowExecutionPlan,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string; // because of draft mode
}) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  const { workflowId, flowDefinition } = form;

  if (!workflowId) throw new Error("WorkflowId is required");

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) throw new Error("Workflow not found!");

  let executionPlan: WorkflowExecutionPlan;

  if (!flowDefinition) {
    throw new Error("Flow Definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("Flow Defintion not valid");
  }

  if (!result.executionPlan) throw new Error("No Execution plan generated");

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: ExecutionStatus.Pending,
      startedAt: new Date(),
      trigger: ExecutionTrigger.Manual,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.Created,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRepository[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("workflow execution not created");
  }

  ExecuteWorkflow(execution.id); // will be run on background

  return {
    success: true,
    redirectTo: `/workflow/runs/${workflowId}/${execution.id}`,
  };
}
