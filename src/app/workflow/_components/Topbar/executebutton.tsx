"use client";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import React from "react";

export default function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log("======= PLAN ======");
        console.table(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-rose-600" /> Execute
    </Button>
  );
}
