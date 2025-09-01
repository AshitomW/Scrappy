"use client";

import { TaskParameter, TaskParameterType } from "@/types/tasks";
import StringParameter from "./parameters/StringParameter";
import { useReactFlow } from "@xyflow/react";
import { FlowNode } from "@/types/appnode";
import { useCallback } from "react";

export default function NodeParameterField({
  parameter,
  nodeId,
}: {
  parameter: TaskParameter;
  nodeId: string;
}) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as FlowNode;
  const value = node?.data.inputs?.[parameter.name];

  const updateNodeParameterValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [parameter.name]: newValue,
        },
      });
    },
    [updateNodeData, parameter.name, node?.data.inputs]
  );

  switch (parameter.type) {
    case TaskParameterType.String:
      return (
        <StringParameter
          parameter={parameter}
          value={value}
          updateNodeParameterValue={updateNodeParameterValue}
        />
      );

    default:
      return (
        <div className="w-full">
          <span className="text-xs text-muted-foreground ">
            Not Implemented
          </span>
        </div>
      );
  }
}
