import { cn } from "@/lib/utils";
import { TaskParameter } from "@/types/tasks";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParameterField from "./NodeParameterField";
import { HandleColor } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParameter;
  nodeId: string;
}) {
  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput == input.name);
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/10"
      )}
    >
      <NodeParameterField
        parameter={input}
        nodeId={nodeId}
        disabled={isConnected}
      />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            HandleColor[input.type]
          )}
        />
      )}
    </div>
  );
}
