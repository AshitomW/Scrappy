import { TaskType } from "@/types/tasks";
import { ExtractTextFromElement } from "./extract_text_from_element";
import { LaunchBrowserTask } from "./launch_browser";
import { PageToHtmlTask } from "./page_to_html";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fill_input";
import { ClickElementTask } from "./click_element";
import { WaitForElementTask } from "./wait_for_element";
import { DeliverViaWebhookTask } from "./deliver_via_webhook";
import { ExtractDataWithAITask } from "./Extract_Data_With_AI";
import { ReadPropertyFromJsonTask } from "./read_property_from_json";

type Repository = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRepository: Repository = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
};
