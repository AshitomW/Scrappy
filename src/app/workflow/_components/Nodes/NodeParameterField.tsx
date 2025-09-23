"use client";

import { TaskParameter, TaskParameterType } from "@/types/tasks";
import StringParameter from "./parameters/StringParameter";
import { useReactFlow } from "@xyflow/react";
import { FlowNode } from "@/types/appnode";
import { useCallback } from "react";
import BrowserInstanceParameter from "./parameters/BrowserInstanceParameter";
import SelectParameter from "./parameters/SelectParameter";

export default function NodeParameterField({
  parameter,
  nodeId,
  disabled,
}: {
  parameter: TaskParameter;
  nodeId: string;
  disabled: boolean;
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
          disabled={disabled}
        />
      );
    case TaskParameterType.Browser_Instance:
      return (
        <BrowserInstanceParameter
          parameter={parameter}
          updateNodeParameterValue={updateNodeParameterValue}
        />
      );

    case TaskParameterType.Select:
      return (
        <SelectParameter
          parameter={parameter}
          value={value}
          updateNodeParameterValue={updateNodeParameterValue}
          disabled={disabled}
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
