"use server";

import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflows.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) throw new Error("Workflow Not Found!!");

  if (workflow.status !== WorkflowStatus.DRAFT)
    throw new Error("Workflow is not a draft");

  await prisma.workflows.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  });
}
