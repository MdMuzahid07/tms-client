"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskWithAssignee } from "@/types";
import { formatDate, getInitials, truncate } from "@/utils";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskTableProps {
  tasks: TaskWithAssignee[];
  onEdit: (task: TaskWithAssignee) => void;
  onDelete: (id: string, title: string) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="bg-card overflow-hidden rounded border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead className="w-[250px]">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="group transition-colors">
                <TableCell className="font-medium">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="decoration-primary flex items-center gap-1.5 underline-offset-4 hover:underline"
                  >
                    {task.title}
                    <ExternalLink className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground cursor-default text-sm">
                          {truncate(task.description || "No description", 40)}
                        </span>
                      </TooltipTrigger>
                      {task.description && task.description.length > 40 && (
                        <TooltipContent className="max-w-[300px]">
                          <p>{task.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  {task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="border-primary/10 h-7 w-7 border">
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-semibold">
                          {getInitials(task.assignedTo.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{task.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(task.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => onEdit(task)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Task</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => onDelete(task.id, task.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Task</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
