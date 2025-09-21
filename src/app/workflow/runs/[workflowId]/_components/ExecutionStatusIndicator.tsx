import { cn } from "@/lib/utils";
import { ExecutionStatus } from "@/types/workflow";
import React from "react";

const indicatorColors: Record<ExecutionStatus, string> = {
  Pending: "bg-slate-400",
  Running: "bg-yellow-400",
  Failed: "bg-red-400",
  Completed: "bg-emerald-600",
};

export default function ExecutionStatusIndicator({
  status,
}: {
  status: ExecutionStatus;
}) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}
