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
      args: [""], // use the proxy here for bot detection bypass
    });

    environment.setBrowser(browser);
    const page = await browser.newPage();
    environment.log.info("Browser started successfully");
    await page.goto(websiteUrl, { waitUntil: "networkidle0" });
    page.setViewport({ width: 1920, height: 1080 });

    // await page.authenticate({}); for bot detection bypass

    environment.setPage(page);
    environment.log.info(`Opened Page At: ${websiteUrl}`);
    await waitFor(10000);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
