import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/ExecuteWorkflow";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import {
  ExecutionPhaseStatus,
  ExecutionStatus,
  ExecutionTrigger,
  WorkflowExecutionPlan,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";
function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;
  if (!workflowId) {
    return Response.json(
      {
        error: "Bad Request",
      },
      { status: 400 }
    );
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    return Response.json(
      {
        error: "Bad Request",
      },
      { status: 400 }
    );
  }
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;

  if (!executionPlan) {
    return Response.json(
      {
        error: "Bad Request",
      },
      { status: 400 }
    );
  }

  let nextRun;
  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true });
    nextRun = cron.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: ExecutionStatus.Pending,
        startedAt: new Date(),
        trigger: ExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.Created,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRepository[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
    return Response.json(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
