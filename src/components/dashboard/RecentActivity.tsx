import { useGetAuditLogsQuery } from '@/redux/feature/audit-logs/auditLogsApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatRelative, getInitials } from '@/utils'
import { AuditActionBadge } from '../audit-logs/AuditActionBadge'
import { Loader2 } from 'lucide-react'

export function RecentActivity() {
  const { data: logs, isLoading } = useGetAuditLogsQuery()

  const recentLogs = logs?.slice(0, 5) || []

  return (
    <Card className="rounded-xl border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activity recorded yet.
          </p>
        ) : (
          <div className="space-y-6">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <Avatar className="h-9 w-9 border border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                    {getInitials(log.actor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate leading-none">
                      {log.actor.name}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelative(log.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1.5">
                    <AuditActionBadge
                      action={log.action}
                      className="w-fit scale-90 origin-left"
                    />
                    <p className="text-sm text-muted-foreground line-clamp-1">
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
  )
}
