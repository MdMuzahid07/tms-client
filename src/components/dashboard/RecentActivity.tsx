import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAuditLogsQuery } from "@/redux/feature/audit-logs/auditLogsApi";
import { formatRelative, getInitials } from "@/utils";
import { Loader2 } from "lucide-react";
import { AuditActionBadge } from "../audit-logs/AuditActionBadge";

export function RecentActivity() {
  const { data: logs, isLoading } = useGetAuditLogsQuery();

  const recentLogs = logs?.slice(0, 5) || [];

  return (
    <Card className="bg-card rounded border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : recentLogs.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No activity recorded yet.
          </p>
        ) : (
          <div className="space-y-6">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <Avatar className="border-primary/10 h-9 w-9 border">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                    {getInitials(log.actor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm leading-none font-semibold">
                      {log.actor.name}
                    </p>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatRelative(log.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1.5">
                    <AuditActionBadge
                      action={log.action}
                      className="w-fit origin-left scale-90"
                    />
                    <p className="text-muted-foreground line-clamp-1 text-sm">
                      {log.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
