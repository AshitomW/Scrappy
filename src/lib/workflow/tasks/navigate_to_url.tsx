import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon, LucideProps, MousePointerClick } from "lucide-react";

export const NavigateToUrlTask = {
  type: TaskType.NAVIGATE_TO_URL,
  label: "Navigate To Url",
  icon: (props: LucideProps) => {
    return <Link2Icon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParameterType.Browser_Instance,
      required: true,
    },
    {
      name: "Url",
      type: TaskParameterType.String,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskParameterType.Browser_Instance,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
