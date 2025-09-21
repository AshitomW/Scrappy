"use client";
import GetWorkflowExecutionWithPhases from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  Circle,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { DateToDurationString } from "@/lib/helpers/date";
import { GetPhasesTotalCost } from "@/lib/helpers/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/GetWorkflowPhaseDetails";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountWrapper from "@/components/ReactCountUpWrapper";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (query) =>
      query.state.data?.status === ExecutionStatus.Running ? 1000 : false,
  });

  const duration = DateToDurationString(
    query.data?.startedAt,
    query.data?.completedAt
  );

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
    refetchInterval: (query) =>
      query.state.data?.status === ExecutionStatus.Running ? 1000 : false,
  });

  const isRunning = query.data?.status === ExecutionStatus.Running;

  useEffect(
    function () {
      // select the currently executing phase
      const phases = query.data?.phases || [];
      if (isRunning) {
        const phaseToSelect = phases.toSorted((a, b) =>
          a.startedAt! > b.startedAt! ? -1 : 1
        )[0];

        setSelectedPhase(phaseToSelect.id);
        return;
      }

      const phaseToSelect = phases.toSorted((a, b) =>
        a.completedAt! > b.completedAt! ? -1 : 1
      )[0];

      setSelectedPhase(phaseToSelect.id);
    },

    [query.data?.phases, isRunning]
  );

  return (
    <div className="flex w-full h-full ">
      <aside className="w-[400px] min-w-[400px] max-w-[400px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="px-2 py-4">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started At"
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits Consumed"
            value={<ReactCountWrapper value={creditsConsumed} />}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => {
            return (
              <Button
                key={phase.id}
                className="w-full justify-between "
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                onClick={() => {
                  if (isRunning) return;
                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <PhaseStatusBadge
                  status={phase.status as ExecutionPhaseStatus}
                />
              </Button>
            );
          })}
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Execution is in progress, please wait</p>
          </div>
        )}

        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No Phase Selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details.
              </p>
            </div>
          </div>
        )}

        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col p-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DateToDurationString(
                    phaseDetails.data.startedAt,
                    phaseDetails.data.completedAt
                  ) || "-"}
                </span>
              </Badge>
            </div>
            {/* Render Details About Execution */}
            <ParameterViewer
              title="Inputs"
              subtitle="Inputs used for this phase"
              parametersJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title="Outputs"
              subtitle="Outputs generated by this phase"
              parametersJSON={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

function ParameterViewer({
  title,
  subtitle,
  parametersJSON,
}: {
  title: string;
  subtitle: string;
  parametersJSON: string | null;
}) {
  const params = parametersJSON ? JSON.parse(parametersJSON) : undefined;
  return (
    <Card className="py-0 rounded-md">
      <CardHeader className="rounded-md rounded-b-none border-b py-4 bg-gray-50">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input
                  readOnly
                  className="flex-1 basis-2/3"
                  value={value as string}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || logs.length == 0) return null;

  return (
    <Card className="w-full py-0 rounded-md">
      <CardHeader className="rounded-md rounded-b-none border-b py-4 bg-gray-50">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs Generated By This Phase.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground ">
                <TableCell
                  width={190}
                  className="text-xs text-muted-foreground p-[2px] pl-2"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-sm font-bold p-[3px] pl-2",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-2">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
