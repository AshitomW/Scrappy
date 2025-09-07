import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { FlowNode } from "@/types/appnode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useExecutionPlan = function () {
  const { toObject } = useReactFlow();
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan } = FlowToExecutionPlan(nodes as FlowNode[], edges);
    return executionPlan;
  }, [toObject]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
