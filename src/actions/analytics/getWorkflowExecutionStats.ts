"use server";

import { PeriodToDateRange } from "@/lib/helpers/date";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = {
  success: number;
  failed: number;
};
export default async function GetWorkflowExecutionStats(period: Period) {
  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: unauthenticated");

  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";
  const stats: Record<string, Stats> = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === ExecutionStatus.Completed) {
      stats[date].success += 1;
    } else if (execution.status === ExecutionStatus.Failed) {
      stats[date].failed += 1;
    }
  });

  return stats;
}
