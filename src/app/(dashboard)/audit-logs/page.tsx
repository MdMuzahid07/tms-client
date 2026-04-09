"use client";

import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";
import { DataTableSkeleton } from "@/components/shared/DataTableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIT_ACTION_OPTIONS } from "@/constants";
import { useGetAuditLogsQuery } from "@/redux/feature/audit-logs/auditLogsApi";
import { AuditAction } from "@/types";
import { ScrollText } from "lucide-react";
import { useMemo, useState } from "react";

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState<AuditAction | "ALL">("ALL");
  const { data: logs, isLoading } = useGetAuditLogsQuery();

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    if (actionFilter === "ALL") return logs;
    return logs.filter((log) => log.action === actionFilter);
  }, [logs, actionFilter]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-16 space-y-6 duration-300">
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activities and task modifications."
        action={
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 h-8 rounded px-4"
          >
            {logs?.length || 0} Total Logs
          </Badge>
        }
      />

      <div className="flex items-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Filter by action:
          </span>
          <Select
            value={actionFilter}
            onValueChange={(val) => setActionFilter(val as AuditAction | "ALL")}
          >
            <SelectTrigger className="h-10 w-[200px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              {AUDIT_ACTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <DataTableSkeleton rows={10} cols={5} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No logs found"
          description={
            actionFilter !== "ALL"
              ? "No activities matches the selected action filter."
              : "System activity will appear here once tasks are managed."
          }
        />
      ) : (
        <AuditLogTable logs={filteredLogs} />
      )}
    </div>
  );
}
