import { ExecutionEnvironment } from "@/types/Executor";
import { AddPropertyToJsonTask } from "../tasks/add_property_to_json";
export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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
    const propertyValue = environment.getInput("Property Value");
    if (!propertyValue) {
      environment.log.error("input->propertyValue is not defined");
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
