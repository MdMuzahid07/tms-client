"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { useGetAuditLogsQuery } from "@/redux/feature/audit-logs/auditLogsApi";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const actionMap: Record<string, { label: string; color: string }> = {
  TASK_CREATED: { label: "Initialized", color: "text-emerald-500 bg-emerald-50" },
  TASK_UPDATED: { label: "Modified", color: "text-blue-500 bg-blue-50" },
  TASK_DELETED: { label: "Purged", color: "text-rose-500 bg-rose-50" },
  TASK_STATUS_CHANGED: { label: "Transmuted", color: "text-amber-500 bg-amber-50" },
  TASK_ASSIGNED: { label: "Delegated", color: "text-indigo-500 bg-indigo-50" },
};

export default function AuditLogsPage() {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const { data: logsRes, isLoading } = useGetAuditLogsQuery(undefined, {
    skip: user?.role !== "ADMIN"
  });

  const [searchTerm, setSearchTerm] = useState("");

  const logs = logsRes?.data || [];
  const filteredLogs = logs.filter((log: any) => 
    log.summary.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.actor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, router]);

  if (isLoading) return <Skeleton className="h-[360px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500">Track task actions and actors.</p>
      </header>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by actor or summary"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
           <Filter size={16} />
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                   <div className="flex flex-col items-center gap-2 text-slate-500">
                      <ShieldAlert size={18} />
                      <p className="text-sm">No logs found.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline" className={`${actionMap[log.action]?.color || "bg-muted"} border-none`}>
                        {actionMap[log.action]?.label || log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-7 w-7">
                            <AvatarFallback>{log.actor?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{log.actor?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="line-clamp-1 text-sm text-slate-600 dark:text-slate-300">
                        {log.summary}
                    </p>
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-500">
                    {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
