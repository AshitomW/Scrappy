"use server";

import { PeriodToDateRange } from "@/lib/helpers/date";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Stats } from "fs";

const { Completed, Failed } = ExecutionStatus;

export async function GetStatistics(period: Period) {
  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: Unauthenticated.");
  const dateRange = PeriodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [Completed, Failed],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: { creditsConsumed: true },
      },
    },
  });

  const statistics = {
    workflowExeuctions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  statistics.creditsConsumed = executions.reduce(
    (acc, execution) => acc + execution.creditsConsumed,
    0
  );

  statistics.phaseExecutions = executions.reduce(
    (acc, execution) => acc + execution.phases.length,
    0
  );

  return statistics;
}
