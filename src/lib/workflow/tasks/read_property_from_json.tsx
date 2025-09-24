import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon, LucideProps, MousePointerClick } from "lucide-react";

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read Property From Json",
  icon: (props: LucideProps) => {
    return <FileJson2Icon className="stroke-rose-400" {...props} />;
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
  ] as const,
  outputs: [
    {
      name: "Property Value",
      type: TaskParameterType.String,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
