import { waitFor } from "@/lib/helpers/waitFor";
import { ExecutionEnvironment } from "@/types/Executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../tasks/launch_browser";
import { PageToHtmlTask } from "../tasks/page_to_html";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    console.log(html);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
//7:10
