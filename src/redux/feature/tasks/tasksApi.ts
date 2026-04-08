import baseApi from "../../api/baseApi";
import type { ApiResponse, Task, TaskStatus } from "@/types/api";

interface TaskPayload {
  title?: string;
  description?: string;
  assignedToId?: string | null;
}

const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<ApiResponse<Task[]>, void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    getTask: builder.query<ApiResponse<Task>, string>({
      query: (id: string) => `/tasks/${id}`,
    }),
    createTask: builder.mutation<ApiResponse<Task>, TaskPayload>({
      query: (data: TaskPayload) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks", "AuditLogs"],
    }),
    updateTask: builder.mutation<ApiResponse<Task>, TaskPayload & { id: string }>(
      {
        query: ({ id, ...data }: TaskPayload & { id: string }) => ({
          url: `/tasks/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Tasks", "AuditLogs"],
      },
    ),
    updateTaskStatus: builder.mutation<
      ApiResponse<Task>,
      { id: string; status: TaskStatus }
    >({
      query: ({ id, status }: { id: string; status: TaskStatus }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks", "AuditLogs"],
    }),
    deleteTask: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id: string) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks", "AuditLogs"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
