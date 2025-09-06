import { LucideProps } from "lucide-react";
import { TaskParameter, TaskType } from "./tasks";

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
