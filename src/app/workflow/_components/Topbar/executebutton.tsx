"use client";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import React from "react";

export default function ExecuteButton({ workflowId }: { workflowId: string }) {
  return (
    <Button variant={"outline"} className="flex items-center gap-2">
      <PlayIcon size={16} className="stroke-rose-600" /> Execute
    </Button>
  );
}
