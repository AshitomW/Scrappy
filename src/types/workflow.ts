import { LucideProps } from "lucide-react";
import { TaskParameter, TaskType } from "./tasks";
import { FlowNode } from "./appnode";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParameter[];
  outputs: TaskParameter[];
  credits: number;
};

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: FlowNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum ExecutionStatus {
  Pending = "Pending",
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
}
export enum ExecutionPhaseStatus {
  Created = "Created",
  Pending = "Pending",
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
}

export enum ExecutionTrigger {
  Manual = "MANUAL",
  CRON = "CRON",
}
