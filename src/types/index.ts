export type Role = 'ADMIN' | 'USER'
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'DONE'
export type AuditAction =
  | 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED'
  | 'TASK_STATUS_CHANGED' | 'TASK_ASSIGNED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface TaskWithAssignee {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  assignedToId: string | null
  assignedTo: Pick<User, 'id' | 'name' | 'email' | 'role'> | null
  createdAt: string
  updatedAt: string
}

export interface AuditLogWithRelations {
  id: string
  action: AuditAction
  actorId: string
  taskId: string
  beforeData: Record<string, unknown> | null
  afterData: Record<string, unknown> | null
  summary: string | null
  createdAt: string
  actor: Pick<User, 'id' | 'name' | 'email' | 'role'>
  task: { id: string; title: string }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>
}

export interface AuthState {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'> | null
  token: string | null
}

export interface CreateTaskRequest {
  title: string
  description?: string
  assignedToId?: string | null
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  assignedToId?: string | null
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus
}
