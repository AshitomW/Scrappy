"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RunButton({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (data) => {
      toast.success("Workflow Started", { id: workflowId });
      router.push(data.redirectTo);
    },
    onError: () => {
      toast.error("Something Went Wrong", { id: workflowId });
    },
  });
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling Runner...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} />
      Execute
    </Button>
  );
}
