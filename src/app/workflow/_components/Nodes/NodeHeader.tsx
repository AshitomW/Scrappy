"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRepository } from "@/lib/workflow/tasks/Repository";
import { TaskType } from "@/types/tasks";
import { CoinsIcon, GripVertical, GripVerticalIcon } from "lucide-react";

export default function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = TaskRepository[taskType];
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
