import { Node } from "@xyflow/react";
import { TaskType } from "./tasks";

export interface FlowNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any; // Any property whose key is a string is allowed and its value can be 'any'
}
export interface FlowNode extends Node {
  data: FlowNodeData;
}
