import { ExecutionEnvironment } from "@/types/Executor";
import { PageToHtmlTask } from "../tasks/page_to_html";
import { FillInputTask } from "../tasks/fill_input";
import { waitFor } from "@/lib/helpers/waitFor";
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input->value not defined");
    }

    await environment.getPage()!.type(selector, value);
    await waitFor(10000);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
