"use client";
import GetWorkflowExecutionWithPhases from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { ExecutionStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, CircleDashedIcon } from "lucide-react";
import React from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (query) =>
      query.state.data?.status === ExecutionStatus.Running ? 1000 : false,
  });

  return (
    <div className="flex w-full h-full ">
      <aside className="w-[400px] min-w-[400px] max-w-[400px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="px-2 py-4">
          {/*Status Label*/}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2 ">
              <CircleDashedIcon size={20} className="stroke-muted-foreground" />
              <span>Status</span>
            </div>
            <div className="font-semibold capitalize flex items-center gap-2">
              {query.data?.status}
            </div>
          </div>
          {/*Started At*/}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CalendarIcon size={20} className="stroke-muted-foreground/80" />
              <span>Started At</span>
            </div>
            <div className="font-semibold capitalize flex items-center gap-2">
              {query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data.startedAt), {
                    addSuffix: true,
                  })
                : "-"}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
