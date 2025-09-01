import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { FlowNodeData } from "@/types/appnode";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import { NodeInput, NodeInputs } from "./NodeInputs";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as FlowNodeData;
  const nodeId = props.id;
  const task = TaskRepository[nodeData.type];
  return (
    <NodeCard isSelected={props.selected} nodeId={nodeId}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input, index) => {
          return <NodeInput key={index} input={input} nodeId={nodeId} />;
        })}
      </NodeInputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
