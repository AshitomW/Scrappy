"use server";

import { prisma } from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { FlowNode } from "@/types/appnode";
import { TaskType } from "@/types/tasks";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";

export async function CreateNewWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid Form Data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("401 Forbidden");
  }

  const initialFlow: { nodes: FlowNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflows.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create new workflow!");
  }
  revalidatePath("/workflows");
  return { status: true, workflowId: result.id };
}
