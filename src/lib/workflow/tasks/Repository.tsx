import { TaskType } from "@/types/tasks";
import { ExtractTextFromElement } from "./extract_text_from_element";
import { LaunchBrowserTask } from "./launch_browser";
import { PageToHtmlTask } from "./page_to_html";
import { WorkflowTask } from "@/types/workflow";

type Repository = {
  [K in TaskType]: WorkflowTask;
};

export const TaskRepository: Repository = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
};
