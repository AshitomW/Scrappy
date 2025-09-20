import { waitFor } from "@/lib/helpers/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/Executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../tasks/launch_browser";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");

    const browser = await puppeteer.launch({
      headless: true, // will open visible browser window. for debug purposes.
    });

    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "networkidle0" });
    environment.setPage(page);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
