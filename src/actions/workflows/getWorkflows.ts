"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkFlowsForUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("401: Unauthenticated");
  }

  const workflows = prisma.workflows.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return workflows;
}
