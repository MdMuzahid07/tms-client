import type { ApiResponse, AuditLog } from "@/types/api";
import baseApi from "../../api/baseApi";

const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<ApiResponse<AuditLog[]>, void>({
      query: () => "/audit-logs",
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;
