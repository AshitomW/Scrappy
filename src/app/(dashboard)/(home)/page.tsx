import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helpers/waitFor";
import { GetStatistics } from "@/actions/analytics/getStatistics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatisticsCard, {
  StatisticsCardSkeleton,
} from "./_components/StatisticsCard";
import GetWorkflowExecutionStats from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import GetCreditsUsageStats from "@/actions/analytics/getCreditsUsageStats";
import CreditsUsageChart from "@/app/(dashboard)/billing/_components/CreditUsageChart";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ year: string; month: string }>;
}) {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    year: year ? parseInt(year) : currentDate.getFullYear(),
    month: month ? parseInt(month) : currentDate.getMonth(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatisticsCardSkeleton />}>
          <StatisticsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditUsageStats selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

async function StatisticsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatistics(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatisticsCard
        title="Workflow Executions"
        value={data.workflowExeuctions}
        icon={CirclePlayIcon}
      />
      <StatisticsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatisticsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditUsageStats({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditsUsageStats(selectedPeriod);
  return <CreditsUsageChart data={data} />;
}
