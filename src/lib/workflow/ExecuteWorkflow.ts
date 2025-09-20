import "server-only";
import { prisma } from "../prisma";

import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helpers/waitFor";
import { revalidatePath } from "next/cache";
import { ExecutionPhase } from "@prisma/client";
import { FlowNode } from "@/types/appnode";
import { TaskRepository } from "./tasks/Repository";
import { ExecutorRepository } from "./Executor/Repository";
import { Environment, ExecutionEnvironment } from "@/types/Executor";
import { TaskParameterType } from "@/types/tasks";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { Log, LogCollector } from "@/types/log";
import { CreateLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment: Environment = { phases: {} };
  await InitializeWorkflowExecution(executionId, execution.workflowId);
  await InitializePhaseStatuses(execution);
  let creditsConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    const phaseExecution = await ExecuteWorkflowPhase(
      execution.userId,
      phase,
      environment,
      edges
    );
    creditsConsumed += phaseExecution.creditsConsumed;
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

  await CleanUpEnvironment(environment);

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

async function ExecuteWorkflowPhase(
  userId: string,
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) {
  const logCollector = CreateLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as FlowNode;

  SetupEnvironmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.Running,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRepository[node.data.type].credits;

  let success = await DecrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;

  if (success) {
    success = await ExecutePhase(phase, node, environment, logCollector);
  }
  const outputs = environment.phases[node.id].outputs;
  await FinalizePhase(
    phase.id,
    success,
    outputs,
    creditsConsumed,
    logCollector
  );

  return { success, creditsConsumed };
}

async function FinalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  creditsConsumed: number,
  logCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.Completed
    : ExecutionPhaseStatus.Failed;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

async function ExecutePhase(
  phase: ExecutionPhase,
  node: FlowNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRepository[node.data.type];
  if (!runFn) return false;

  const exeuctionEnvironment: ExecutionEnvironment<any> =
    CreateExecutionEnvironment(node, environment, logCollector);

  return await runFn(exeuctionEnvironment);
}

function SetupEnvironmentForPhase(
  node: FlowNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRepository[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParameterType.Browser_Instance) continue;

    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    const connectedEdge = edges.find(
      (edge) => edge.target == node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error(
        "Missing Edge For Input : ",
        input.name,
        "\nNode Id: ",
        node.id
      );
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function CreateExecutionEnvironment(
  node: FlowNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    log: logCollector,
  };
}

async function CleanUpEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((error) => console.error("Cannot close browser,Reason:", error));
  }
}

async function DecrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return true;
  } catch (error) {
    logCollector.error("Insufficient Balance");
    return false;
  }
}
