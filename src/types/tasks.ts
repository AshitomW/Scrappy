export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
}

export enum TaskParameterType {
  String = "string",
  Browser_Instance = "Browser_Instance",
}

export interface TaskParameter {
  name: string;
  type: TaskParameterType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
}
