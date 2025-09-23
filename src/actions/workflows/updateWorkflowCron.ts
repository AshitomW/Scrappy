"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
export default async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  try {
    const interval = parser.parseExpression(cron, { utc: true });
    return await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("Invalid Cron:", error.message);
    throw new Error("Invalid Cron Expression");
  }
}
