export type Role = "ADMIN" | "USER";
export type TaskStatus = "PENDING" | "PROCESSING" | "DONE";
export type AuditAction =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_STATUS_CHANGED"
  | "TASK_ASSIGNED";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedToId: string | null;
  assignedTo: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  actorId: string;
  taskId: string;
  summary: string | null;
  beforeData: unknown;
  afterData: unknown;
  createdAt: string;
  actor: User;
  task: Task;
}
