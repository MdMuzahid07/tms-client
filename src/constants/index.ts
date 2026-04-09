import { CheckSquare, ScrollText, Users } from "lucide-react";

export const TASK_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "DONE", label: "Done" },
];

export const AUDIT_ACTION_OPTIONS = [
  { value: "TASK_CREATED", label: "Task Created" },
  { value: "TASK_UPDATED", label: "Task Updated" },
  { value: "TASK_DELETED", label: "Task Deleted" },
  { value: "TASK_STATUS_CHANGED", label: "Status Changed" },
  { value: "TASK_ASSIGNED", label: "Task Assigned" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Users", href: "/users", icon: Users },
  { label: "Audit Logs", href: "/audit-logs", icon: ScrollText },
];

export const USER_NAV_ITEMS = [
  { label: "My Tasks", href: "/my-tasks", icon: CheckSquare },
];
