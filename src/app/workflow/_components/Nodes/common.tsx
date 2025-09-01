import { TaskParameterType } from "@/types/tasks";

export const HandleColor: Record<TaskParameterType, string> = {
  [TaskParameterType.Browser_Instance]: "!bg-sky-400",
  [TaskParameterType.String]: "!bg-amber-400 ",
};
