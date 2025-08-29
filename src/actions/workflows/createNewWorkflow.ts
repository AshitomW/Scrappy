"use server";

import { prisma } from "@/lib/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function CreateNewWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid Form Data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("401 Forbidden");
  }

  const result = await prisma.workflows.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "Work Needs to be done!",
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create new workflow!");
  }

  return { status: true, workflowId: result.id };
}
