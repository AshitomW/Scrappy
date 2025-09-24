import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
    }

    await Promise.all([
      environment.getPage()!.click(selector),
      environment.getPage()?.waitForNavigation(),
    ]);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
