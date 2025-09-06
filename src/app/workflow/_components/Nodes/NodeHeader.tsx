"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import { FlowNode } from "@/types/appnode";
import { TaskType } from "@/types/tasks";
import { useReactFlow } from "@xyflow/react";
import {
  CoinsIcon,
  CopyIcon,
  GripVertical,
  GripVerticalIcon,
  TrashIcon,
} from "lucide-react";

export default function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const task = TaskRepository[taskType];

  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <span className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </span>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />5 {/* TODO */}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  const node = getNode(nodeId) as FlowNode;
                  const newX = node.position.x;
                  const newY = node.position.y;

                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY + node.measured?.height! + 20,
                  });
                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
