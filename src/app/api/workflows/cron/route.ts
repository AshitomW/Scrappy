import { getAppUrl } from "@/lib/helpers/appurl";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  console.log("@@Workflows to run", workflows.length);

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return new Response(null, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );

  fetch(triggerApiUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  }).catch((error) =>
    console.error(
      "Error Triggering Workflow With Id: ",
      workflowId,
      " @Error:",
      error.message
    )
  );
}
