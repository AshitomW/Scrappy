import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
import { NavigateToUrlTask } from "../tasks/navigate_to_url";
export async function NavigateToUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateToUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("Url");
    if (!url) {
      environment.log.error("input->selector is not defined");
    }

    await environment.getPage()!.goto(url, { waitUntil: "networkidle0" });
    environment.log.info(`visited ${url}`);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
