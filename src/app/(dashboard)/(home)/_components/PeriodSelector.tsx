"use client";

import { Period } from "@/types/analytics";

interface Props {
  periods: Period[];
  selectedPeriod: Period;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export default function PeriodSelector({ periods, selectedPeriod }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select
      value={`${selectedPeriod.year}-${selectedPeriod.month}`}
      onValueChange={(value) => {
        const [year, month] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);

        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => {
          return (
            <SelectItem key={index} value={`${period.year}-${period.month}`}>
              {`${period.year} ${MONTH_NAMES[period.month]}`}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
