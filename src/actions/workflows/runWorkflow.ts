"use server";

import { prisma } from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string; // because of draft mode
}) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  const { workflowId, flowDefinition } = form;

  if (!workflowId) throw new Error("WorkflowId is required");

  const workflow = await prisma.workflows.findUnique({
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

  console.log("The Plan : ", executionPlan);
}
