import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { FlowNodeData } from "@/types/appnode";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as FlowNodeData;
  const nodeId = props.id;
  const task = TaskRepository[nodeData.type];
  return (
    <NodeCard isSelected={props.selected} nodeId={nodeId}>
      {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {task.inputs.map((input, index) => {
          return <NodeInput key={index} input={input} nodeId={nodeId} />;
        })}
      </NodeInputs>

      <NodeOutputs>
        {task.outputs.map((output, index) => {
          return <NodeOutput key={index} output={output} />;
        })}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
