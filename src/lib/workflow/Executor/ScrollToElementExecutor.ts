import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
import { ScrollToElementTask } from "../tasks/scroll_to_element";
export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
    }

    await environment.getPage()?.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error("Element Not Found!");
      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y });
    }, selector);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
