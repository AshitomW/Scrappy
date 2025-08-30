import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { FlowNodeData } from "@/types/appnode";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as FlowNodeData;
  return (
    <NodeCard isSelected={props.selected} nodeId={props.id}>
      <NodeHeader taskType={nodeData.type} />
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
