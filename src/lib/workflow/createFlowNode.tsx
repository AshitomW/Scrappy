import { FlowNode } from "@/types/appnode";
import { TaskType } from "@/types/tasks";

export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): FlowNode {
  return {
    id: crypto.randomUUID(),
    type: "FlowNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
