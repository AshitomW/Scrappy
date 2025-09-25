"use client";

import GetCreditsUsageStats from "@/actions/analytics/getCreditsUsageStats";
import GetWorkflowExecutionStats from "@/actions/analytics/getWorkflowExecutionStats";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ChartColumnStacked,
  ChartColumnStackedIcon,
  Layers2Icon,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageStats>>;
const chartConfig = {
  success: {
    label: "Successful phases credits",
  },
  failed: {
    label: "Failed phases credits",
  },
};

export default function CreditsUsageChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          Daily Credits Spent
        </CardTitle>
        <CardDescription>
          Daily credits consumed in selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fill="var(--color-chart-2)"
              stroke="var(--color-chart-2)"
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              dataKey={"failed"}
              fill="var(--color-chart-3)"
              stroke="var(--color-chart-3)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
