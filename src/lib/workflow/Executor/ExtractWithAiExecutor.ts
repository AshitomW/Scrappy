import { ExecutionEnvironment } from "@/types/Executor";
import { waitFor } from "@/lib/helpers/waitFor";
import { ClickElementTask } from "../tasks/click_element";
import { ExtractDataWithAITask } from "../tasks/Extract_Data_With_AI";
import { prisma } from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GoogleGenAI } from "@google/genai";
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

    const ai = new GoogleGenAI({ apiKey: plainCredentials });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
