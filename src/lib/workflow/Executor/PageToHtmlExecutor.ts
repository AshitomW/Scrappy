import { ExecutionEnvironment } from "@/types/Executor";
import { PageToHtmlTask } from "../tasks/page_to_html";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
