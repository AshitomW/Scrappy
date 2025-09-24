import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { Brain, LucideProps, MousePointerClick } from "lucide-react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract Data With Ai",
  icon: (props: LucideProps) => {
    return <Brain className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Content",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParameterType.Credential,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParameterType.String,
      variant: "textarea",
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParameterType.String,
    },
  ] as const,
  credits: 10,
} satisfies WorkflowTask;
