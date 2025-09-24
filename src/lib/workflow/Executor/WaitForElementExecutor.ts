import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
import { WaitForElementTask } from "../tasks/wait_for_element";
export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
    }
    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input->visibility is not defined");
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    environment.log.info(`Element ${selector} became: ${visibility}`);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
