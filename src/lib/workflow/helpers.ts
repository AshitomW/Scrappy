import { FlowNode } from "@/types/appnode";
import { TaskRepository } from "./tasks/Repository";

export function CalculateWorkflowCost(nodes: FlowNode[]) {
  return nodes.reduce(
    (acc, node) => acc + TaskRepository[node.data.type].credits,
    0
  );
}

export function parseGeminiResponse(response: string) {
  const cleaned = response.replace(/^```json\s*|\s*```$/g, "");
  return cleaned;
}
