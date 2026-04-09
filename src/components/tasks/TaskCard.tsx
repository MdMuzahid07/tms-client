"use client";

import { TaskWithAssignee } from "@/types";
import { cn, formatDate } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { UpdateStatusForm } from "./UpdateStatusForm";

interface TaskCardProps {
  task: TaskWithAssignee;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={cn(
        "bg-card overflow-hidden rounded border transition-all duration-200",
        isExpanded
          ? "ring-primary/20 shadow-lg ring-2"
          : "hover:border-primary/30 hover:shadow-sm",
      )}
    >
      <div
        className="cursor-pointer p-5 select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <TaskStatusBadge status={task.status} />
          {isExpanded ? (
            <ChevronUp className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          )}
        </div>

        <h3 className="text-foreground leading-tight font-semibold">
          {task.title}
        </h3>

        {!isExpanded && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {task.description || "No description provided."}
          </p>
        )}

        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase">
          <Calendar className="h-3 w-3" />
          Assigned {formatDate(task.createdAt)}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t"
          >
            <div className="space-y-6 p-5 pt-4">
              <div>
                <h4 className="text-muted-foreground mb-2 text-xs font-bold tracking-widest uppercase">
                  Full Description
                </h4>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-widest uppercase">
                  Update Status
                </h4>
                <UpdateStatusForm
                  taskId={task.id}
                  currentStatus={task.status}
                  onSuccess={() => setIsExpanded(false)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
