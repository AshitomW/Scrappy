import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpDownIcon, LucideProps, MousePointerClick } from "lucide-react";

export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll To Element",
  icon: (props: LucideProps) => {
    return <ArrowUpDownIcon className="stroke-rose-400" {...props} />;
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
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskParameterType.Browser_Instance,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
