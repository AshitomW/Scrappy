export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
  READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
}

export enum TaskParameterType {
  String = "string",
  Browser_Instance = "Browser_Instance",
  Select = "Select",
  Credential = "Credential",
}

export interface TaskParameter {
  name: string;
  type: TaskParameterType;
  helperText?: string;
  required?: boolean;
  variant?: string;
  hideHandle?: boolean;
  [key: string]: any;
}
