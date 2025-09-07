"use client";

import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useExecutionPlan = function () {
  const { toObject } = useReactFlow();
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const result = FlowToExecutionPlan(nodes, edges);
  }, [toObject]);
};

export default useExecutionPlan;
