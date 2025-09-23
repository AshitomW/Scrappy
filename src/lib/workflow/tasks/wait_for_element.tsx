import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon, LucideProps, MousePointerClick } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait For Element",
  icon: (props: LucideProps) => {
    return <EyeIcon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Webpage",
      type: TaskParameterType.Browser_Instance,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Visibility",
      type: TaskParameterType.Select,
      required: true,
      hideHandle: true,
      options: [
        {
          label: "Visible",
          value: "visible",
        },
        {
          label: "Hidden",
          value: "hidden",
        },
      ],
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
