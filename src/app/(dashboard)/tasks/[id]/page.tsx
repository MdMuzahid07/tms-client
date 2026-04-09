"use client";

import { AuditLogTimeline } from "@/components/audit-logs/AuditLogTimeline";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAuditLogsByTaskQuery } from "@/redux/feature/audit-logs/auditLogsApi";
import { useGetTaskByIdQuery } from "@/redux/feature/tasks/tasksApi";
import { formatDateTime, getInitials } from "@/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Pencil,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: task, isLoading: isTaskLoading } = useGetTaskByIdQuery(
    id as string,
  );
  const { data: logs, isLoading: isLogsLoading } = useGetAuditLogsByTaskQuery(
    id as string,
  );

  if (isTaskLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Task not found</h2>
        <p className="text-muted-foreground mt-2">
          The task {`you're`} looking for {`doesn't`} exist or has been deleted.
        </p>
        <Button asChild className="mt-8">
          <Link href="/tasks">Return to Tasks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-20 duration-300">
      <div className="flex flex-col gap-4">
        <Link
          href="/tasks"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
        <PageHeader
          title={task.title}
          action={
            <Button onClick={() => setIsEditOpen(true)} className="h-10">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="bg-card/50 overflow-hidden rounded-xl border">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-muted-foreground mb-3 text-xs font-bold tracking-widest uppercase">
                    Description
                  </h3>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {task.description || (
                      <span className="text-muted-foreground italic">
                        No description provided for this task.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    Current Status:
                  </h3>
                  <TaskStatusBadge
                    status={task.status}
                    className="px-3 py-1 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline Section */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Clock className="text-primary h-5 w-5" />
              Activity Timeline
            </h2>
            <AuditLogTimeline logs={logs || []} />
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          <Card className="bg-card/50 rounded-xl border">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500/10">
                    <User className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      Assigned To
                    </h4>
                    {task.assignedTo ? (
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                            {getInitials(task.assignedTo.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {task.assignedTo.name}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Unassigned
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      Created
                    </h4>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(task.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      Last Updated
                    </h4>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(task.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskForm
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
      />
    </div>
  );
}
