import { ExtractTextFromElement } from "@/lib/workflow/tasks/extract_text_from_element";

import { Environment, ExecutionEnvironment } from "@/types/Executor";
import * as cheerio from "cheerio";
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) return false;

    const html = environment.getInput("Html");
    if (!html) return false;

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("Element Not Found");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
