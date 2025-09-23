"use client";

import UpdateWorkflowCron from "@/actions/workflows/updateWorkflowCron";
import CustomDialogHeader from "@/components/CustomDIalogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

export default function SchedulerDialog(props: {
  workflowId: string;
  cron: string | null;
}) {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const humanCronString = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronString);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule update successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something Went Wrong", { id: "cron" });
    },
  });

  const removeSchedulerMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Remove schedule successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something Went Wrong", { id: "cron" });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3 mr-1" /> Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule Workflow Execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC
          </p>
          <Input
            placeholder="E.g * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm  border-destructive text-destructive",
              validCron && "border-emerald-400 text-emerald-600"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={
                    mutation.isPending || removeSchedulerMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeSchedulerMutation.mutate(props.workflowId);
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 ">
          <DialogClose asChild>
            <Button className="flex-1" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="flex-1"
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                mutation.mutate({
                  id: props.workflowId,
                  cron,
                });
              }}
              disabled={mutation.isPending || !validCron}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
