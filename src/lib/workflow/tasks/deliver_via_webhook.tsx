import { TaskParameterType, TaskType } from "@/types/tasks";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, MousePointerClick, SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver Via Webhook",
  icon: (props: LucideProps) => {
    return <SendIcon className="stroke-rose-400" {...props} />;
  },

  isEntryPoint: false,
  inputs: [
    {
      name: "Target Url",
      type: TaskParameterType.String,
      required: true,
    },
    {
      name: "Body",
      type: TaskParameterType.String,
      required: true,
    },
  ] as const,
  outputs: [] as const,
  credits: 3,
} satisfies WorkflowTask;
