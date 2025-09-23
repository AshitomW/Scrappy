"use client";

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
import { CalendarIcon, TriangleAlertIcon } from "lucide-react";

export default function SchedulerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto")}
        >
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="h-3 w-3 mr-1" /> Set Schedule
          </div>
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
          <Input placeholder="E.g * * * * *" />
        </div>
        <DialogFooter className="px-6 !flex-col">
          <DialogClose asChild>
            <Button className="w-full">Save</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="w-full" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
