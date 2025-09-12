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
      headless: true, // will open visible browser window. for debug purposes.
    });

    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.goto(websiteUrl);
    environment.setPage(page);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
