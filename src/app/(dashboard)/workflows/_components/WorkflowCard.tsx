"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Workflow } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ExecutionStatus, WorkflowStatus } from "@/types/workflow";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatInTimeZone } from "date-fns-tz";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/TooltipWrapper";
import { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunButton from "./RunButton";
import SchedulerDialog from "./SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";

interface Props {
  workflow: Workflow;
}

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

export default function WorkflowCard({ workflow }: Props) {
  const isDraft = workflow.status == WorkflowStatus.DRAFT;
  return (
    <Card className="border gap-0 p-0 border-separate  rounded-md overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-6 flex items-center justify-between h-[100px]">
        <div className="flex justify-center items-center space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
            <ScheduleSection
              workflowId={workflow.id}
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} /> Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowId: string;
  workflowName: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size="sm">
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={16} className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) return;
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credits consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="w-4 h-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const formattedStartedAt =
    workflow.lastRunAt &&
    formatDistanceToNow(workflow.lastRunAt, { addSuffix: true });

  const nextSchedule =
    workflow.nextRunAt && format(workflow.nextRunAt, "yyyy-MM-dd HH:mm");

  const nextScheduleUTC =
    workflow.nextRunAt && formatInTimeZone(workflow.nextRunAt, "UTC", "HH:mm");

  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  if (isDraft) return;

  return (
    <div className="bg-primary/5 px-4 py-2 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {workflow.lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${workflow.lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last Run:</span>
            <ExecutionStatusIndicator
              status={workflow.lastRunStatus as ExecutionStatus}
            />
            <span>{workflow.lastRunStatus}</span>
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )}
        {!workflow.lastRunAt && <p>No Executions Yet</p>}
      </div>
      {workflow.nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={18} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span>({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
}
