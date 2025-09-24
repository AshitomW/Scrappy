import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import {
  DatabaseIcon,
  FileJson2Icon,
  LucideProps,
  MousePointerClick,
} from "lucide-react";

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add Property To Json",
  icon: (props: LucideProps) => {
    return <DatabaseIcon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "JSON",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Property Name",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Property Value",
      type: TaskParameterType.String,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Updated JSON",
      type: TaskParameterType.String,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
