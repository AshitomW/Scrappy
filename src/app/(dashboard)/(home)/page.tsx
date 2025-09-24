import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";

export default function page() {
  return (
    <div>
      <Suspense>
        <PeriodSelectorWrapper />
      </Suspense>
    </div>
  );
}

async function PeriodSelectorWrapper() {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} />;
}
