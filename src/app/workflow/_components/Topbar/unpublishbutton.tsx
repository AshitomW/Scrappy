"use client";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { UnpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";

import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { BookMinus, DownloadIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function UnPublishButton({
  workflowId,
}: {
  workflowId: string;
}) {
  const router = useRouter();
  const generate = useExecutionPlan();

  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: (data) => {
      toast.success("Workflow Unpublished", { id: workflowId });
      router.push(data.redirectTo);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) return;
        toast.loading("Unpublishing Workflow....", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-primary-400" /> UnPublish
    </Button>
  );
}
