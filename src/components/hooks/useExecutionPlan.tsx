import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/ExecutionPlan";
import { FlowNode } from "@/types/appnode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";
import { clear } from "console";

const useExecutionPlan = function () {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    function (error: any) {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRYPOINT:
          toast.error("No Entry Point Defined");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as FlowNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
