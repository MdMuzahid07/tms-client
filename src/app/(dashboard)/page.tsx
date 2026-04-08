"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { useGetTasksQuery } from "@/redux/feature/tasks/tasksApi";
import { useGetAuditLogsQuery } from "@/redux/feature/audit-logs/auditLogsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  History,
  Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const { data: tasksRes, isLoading: tasksLoading } = useGetTasksQuery(undefined);
  const { data: logsRes, isLoading: logsLoading } = useGetAuditLogsQuery(undefined, { 
    skip: user?.role !== "ADMIN" 
  });

  const tasks = tasksRes?.data || [];
  const logs = (logsRes?.data || []).slice(0, 5);

  const statusCounts = {
    PENDING: tasks.filter((t: any) => t.status === "PENDING").length,
    PROCESSING: tasks.filter((t: any) => t.status === "PROCESSING").length,
    DONE: tasks.filter((t: any) => t.status === "DONE").length,
  };

  const activityData = [
    { day: "MON", count: 2 },
    { day: "TUE", count: 5 },
    { day: "WED", count: 3 },
    { day: "THU", count: 8 },
    { day: "FRI", count: 6 },
    { day: "SAT", count: 2 },
    { day: "SUN", count: 4 },
  ];

  if (tasksLoading || (user?.role === "ADMIN" && logsLoading)) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-base text-slate-500">Workspace snapshot for {format(new Date(), "MMMM dd, yyyy")}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: tasks.length, icon: ListTodo },
          { label: "Pending", value: statusCounts.PENDING, icon: AlertCircle },
          { label: "Processing", value: statusCounts.PROCESSING, icon: Clock },
          { label: "Done", value: statusCounts.DONE, icon: CheckCircle2 },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg">Task Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History size={16} />
              Recent Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {user?.role !== "ADMIN" ? (
              <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Activity className="mb-2 h-4 w-4" />
                Audit logs are visible for admin users only.
              </div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-slate-500">No audit logs yet.</p>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <p className="text-sm font-semibold">{log.actor?.name}</p>
                  <p className="text-sm text-slate-500">{log.summary}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
