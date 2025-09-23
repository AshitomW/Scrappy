import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, Edit3Icon, GlobeIcon, LucideProps } from "lucide-react";

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  credits: 1,
  icon: (props) => {
    return <Edit3Icon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParameterType.Browser_Instance,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Value",
      type: TaskParameterType.String,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParameterType.Browser_Instance,
    },
  ] as const,
} satisfies WorkflowTask;
