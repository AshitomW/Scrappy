import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElement = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract from Element",
  icon: (props: LucideProps) => {
    return <TextIcon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskParameterType.String,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParameterType.String,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParameterType.String,
    },
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
