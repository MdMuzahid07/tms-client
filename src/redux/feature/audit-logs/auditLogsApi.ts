import { baseApi } from '../../api/baseApi'
import { AuditLogWithRelations } from '../../../types'

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogWithRelations[], void>({
      query: () => '/audit-logs',
      providesTags: ['AuditLog'],
    }),
    getAuditLogsByTask: builder.query<AuditLogWithRelations[], string>({
      query: (taskId) => `/audit-logs/task/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'AuditLog', id: taskId }],
    }),
  }),
})

export const { useGetAuditLogsQuery, useGetAuditLogsByTaskQuery } = auditLogsApi
