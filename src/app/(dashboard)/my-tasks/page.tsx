"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTasksQuery } from "@/redux/feature/tasks/tasksApi";
import { useAppSelector } from "@/redux/hooks";
import { TaskStatus } from "@/types";
import { Inbox, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function MyTasksPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TaskStatus | "ALL">("ALL");

  const { data: tasks, isLoading } = useGetTasksQuery();

  const myTasks = useMemo(() => {
    if (!tasks || !user) return [];
    // The API might return all tasks, so we filter by assignee
    return tasks.filter((task) => task.assignedToId === user.id);
  }, [tasks, user]);

  const filteredTasks = useMemo(() => {
    if (activeTab === "ALL") return myTasks;
    return myTasks.filter((task) => task.status === activeTab);
  }, [myTasks, activeTab]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-20 duration-300">
      <PageHeader
        title="My Tasks"
        subtitle="Manage and track your assigned tasks and their progress."
      />

      <Tabs
        defaultValue="ALL"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TaskStatus | "ALL")}
        className="w-full"
      >
        <TabsList className="bg-muted/50 h-11 rounded border p-1">
          <TabsTrigger value="ALL" className="rounded-md px-6">
            All
          </TabsTrigger>
          <TabsTrigger value="PENDING" className="rounded-md px-6">
            Pending
          </TabsTrigger>
          <TabsTrigger value="PROCESSING" className="rounded-md px-6">
            Processing
          </TabsTrigger>
          <TabsTrigger value="DONE" className="rounded-md px-6">
            Done
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm">
            Loading your tasks...
          </p>
        </div>
      ) : myTasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tasks assigned"
          description="You don't have any tasks assigned to you right now. Relax or check back later."
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tasks in this category"
          description={`You don't have any tasks with status "${activeTab.toLowerCase()}" at the moment.`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
