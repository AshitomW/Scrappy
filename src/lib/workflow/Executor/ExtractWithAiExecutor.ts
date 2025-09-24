import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
import { ExtractDataWithAITask } from "../tasks/Extract_Data_With_AI";
import { prisma } from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { OpenAI } from "openai";
export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->credentials not defined");
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt not defined");
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->content not defined");
    }

    const credential = await prisma.credentials.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const plainCredentials = symmetricDecrypt(credential.value);
    if (!plainCredentials) {
      environment.log.error("could not decrypt credentials");
      return false;
    }

    const openai = new OpenAI({
      apiKey: plainCredentials,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts idata from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding.",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });

    environment.log.info(`Prompt Tokens : ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion Tokens : ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;
    console.log("@@RESULT: ", result);
    if (!result) {
      environment.log.error("empty response from ai");
      return false;
    }

    environment.setOutput("Extracted Data", result);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
