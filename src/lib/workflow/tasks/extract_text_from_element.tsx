import { TaskParameterType, TaskType } from "@/types/tasks";
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
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParameterType.String,
    },
  ],
  credits: 2,
};
