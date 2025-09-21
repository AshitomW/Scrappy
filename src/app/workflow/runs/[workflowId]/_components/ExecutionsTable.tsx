"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateToDurationString } from "@/lib/helpers/date";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { ExecutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { exec } from "child_process";

type InitialWorkflowData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export default function ExecutionsTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialWorkflowData;
}) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["execution", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });

  return (
    <div className="border rounded-md shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Credits Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data.map((execution) => {
            const duration = DateToDurationString(
              execution.startedAt,
              execution.completedAt
            );

            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, { addSuffix: true });
            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/workflow/runs/${workflowId}/${execution.id}`);
                }}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggered via </span>
                      <Badge variant={"outline"}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <ExecutionStatusIndicator
                        status={execution.status as ExecutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
