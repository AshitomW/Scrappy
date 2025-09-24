import { ExecutionEnvironment } from "@/types/Executor";

import { ReadPropertyFromJsonTask } from "../tasks/read_property_from_json";
export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->jsonData is not defined");
    }
    const propertyName = environment.getInput("Property Name");
    if (!jsonData) {
      environment.log.error("input->propertyName is not defined");
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error("Property Not Found");
      return false;
    }

    environment.setOutput("Property Value", propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
