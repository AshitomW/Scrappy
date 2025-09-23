import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, MousePointerClick } from "lucide-react";

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props: LucideProps) => {
    return <MousePointerClick className="stroke-rose-400" {...props} />;
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
