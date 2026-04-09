"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTaskStatusMutation } from "@/redux/feature/tasks/tasksApi";
import { TaskStatus } from "@/types";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateStatusFormProps {
  taskId: string;
  currentStatus: TaskStatus;
  onSuccess?: () => void;
}

export function UpdateStatusForm({
  taskId,
  currentStatus,
  onSuccess,
}: UpdateStatusFormProps) {
  const [newStatus, setNewStatus] = useState<TaskStatus>(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const getValidNextStatuses = (status: TaskStatus): TaskStatus[] => {
    switch (status) {
      case "PENDING":
        return ["PENDING", "PROCESSING"];
      case "PROCESSING":
        return ["PROCESSING", "DONE"];
      case "DONE":
        return ["DONE"];
      default:
        return [];
    }
  };

  const validOptions = getValidNextStatuses(currentStatus);
  const isDone = currentStatus === "DONE";

  const handleUpdate = async () => {
    if (newStatus === currentStatus) return;
    try {
      await updateStatus({ id: taskId, data: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${newStatus.toLowerCase()}`);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (isDone) {
    return (
      <div className="flex w-fit items-center gap-2 rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-medium">Task Completed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <Select
        value={newStatus}
        onValueChange={(val) => setNewStatus(val as TaskStatus)}
        disabled={isLoading}
      >
        <SelectTrigger className="h-10 w-full sm:w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {validOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={isLoading || newStatus === currentStatus}
        className="h-10 w-full px-6 sm:w-auto"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </div>
  );
}
