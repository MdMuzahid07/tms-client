"use client";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTableSkeleton } from "@/components/shared/DataTableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "@/redux/feature/tasks/tasksApi";
import { TaskStatus, TaskWithAssignee } from "@/types";
import { ClipboardList, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function TasksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(
    null,
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [assignee, setAssignee] = useState<string | "ALL">("ALL");

  const { data: tasks, isLoading } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || task.status === status;
      const matchesAssignee =
        assignee === "ALL" || task.assignedToId === assignee;

      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [tasks, search, status, assignee]);

  const handleEdit = (task: TaskWithAssignee) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTaskToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id).unwrap();
      toast.success("Task deleted successfully");
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-16 space-y-6 duration-300">
      <PageHeader
        title="Tasks"
        subtitle="Manage and organize your project tasks efficiently."
        action={
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsFormOpen(true);
            }}
            className="h-10"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        }
      />

      <TaskFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        assignee={assignee}
        setAssignee={setAssignee}
      />

      {isLoading ? (
        <DataTableSkeleton rows={6} cols={6} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            search || status !== "ALL" || assignee !== "ALL"
              ? "Try adjusting your filters to find what you're looking for."
              : "Start by creating your first task to get things moving."
          }
          action={
            !(search || status !== "ALL" || assignee !== "ALL") && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )
          }
        />
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <TaskForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Task"
        description={`This action cannot be undone. Task "${taskToDelete?.title}" will be permanently deleted.`}
        isLoading={isDeleting}
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
