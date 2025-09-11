import { waitFor } from "@/lib/helpers/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/Executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../tasks/launch_browser";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log("@url : ", websiteUrl);
    const browser = await puppeteer.launch({
      headless: false, // will open visible browser window. for debug purposes.
    });

    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
