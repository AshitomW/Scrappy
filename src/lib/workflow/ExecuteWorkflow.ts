import "server-only";
import { prisma } from "../prisma";

import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helpers/waitFor";
import { revalidatePath } from "next/cache";
import { ExecutionPhase } from "@prisma/client";
import { FlowNode } from "@/types/appnode";
import { TaskRepository } from "./tasks/Repository";
import { ExecutorRepository } from "./Executor/Repository";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const environment = { phases: {} };
  await InitializeWorkflowExecution(executionId, execution.workflowId);
  await InitializePhaseStatuses(execution);
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await ExecuteWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
    }
  }

  await FinalizeWorkflowExeuction(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  revalidatePath("/workflow/runs");
}

async function InitializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: ExecutionStatus.Running,
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: ExecutionStatus.Running,
      lastRunId: executionId,
    },
  });
}
async function InitializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionStatus.Pending,
    },
  });
}

async function FinalizeWorkflowExeuction(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? ExecutionStatus.Completed
    : ExecutionStatus.Completed;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: { id: workflowId, lastRunId: executionId },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      console.log(err);
    });
}

async function ExecuteWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as FlowNode;

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.Running,
      startedAt,
    },
  });

  const creditsRequired = TaskRepository[node.data.type].credits;

  const success = await ExecutePhase(phase, node);

  await FinalizePhase(phase.id, success);

  return { success };
}

async function FinalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.Completed
    : ExecutionPhaseStatus.Failed;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function ExecutePhase(
  phase: ExecutionPhase,
  node: FlowNode
): Promise<boolean> {
  const runFn = ExecutorRepository[node.data.type];
  if (!runFn) return false;

  return await runFn();
}
