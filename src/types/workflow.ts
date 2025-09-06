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

export type WorkflowExecutionPlan = {
  phase: number;
  nodes: FlowNode[];
}[];
