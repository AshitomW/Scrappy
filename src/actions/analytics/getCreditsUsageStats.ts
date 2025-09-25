"use server";

import { PeriodToDateRange } from "@/lib/helpers/date";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = {
  success: number;
  failed: number;
};
export default async function GetCreditsUsageStats(period: Period) {
  const { userId } = await auth();
  if (!userId) throw new Error("Forbidden: unauthenticated");

  const dateRange = PeriodToDateRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
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

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === ExecutionPhaseStatus.Completed) {
      stats[date].success += phase.creditsConsumed || 0;
    } else if (phase.status === ExecutionPhaseStatus.Failed) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
