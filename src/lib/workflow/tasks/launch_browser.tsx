// Configuration For Launch Browser Task

import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-500" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website Url",
      type: TaskParameterType.String,
      helperText: "eg: https://www.example.com",
      required: true,
      hideHandle: true,
    },
  ] as const,

  outputs: [
    { name: "Web Page", type: TaskParameterType.Browser_Instance },
  ] as const,
  credits: 5,
} satisfies WorkflowTask;
