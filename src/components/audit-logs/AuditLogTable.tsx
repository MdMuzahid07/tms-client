"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuditLogWithRelations } from "@/types";
import { formatDateTime, getInitials } from "@/utils";
import { Eye, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuditActionBadge } from "./AuditActionBadge";

interface AuditLogTableProps {
  logs: AuditLogWithRelations[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogWithRelations | null>(
    null,
  );

  return (
    <>
      <div className="bg-card overflow-hidden rounded border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="group hover:bg-accent/40 cursor-pointer transition-colors"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell className="text-sm whitespace-nowrap">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground">
                            {formatDateTime(log.createdAt)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(log.createdAt).toLocaleString()}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="border-primary/10 h-6 w-6 border">
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-semibold">
                          {getInitials(log.actor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {log.actor.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AuditActionBadge action={log.action} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/tasks/${log.taskId}`}
                      className="decoration-primary flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {log.task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground line-clamp-1 max-w-[200px] text-xs">
                            {log.summary}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>{log.summary}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <Eye className="text-muted-foreground ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Info className="text-primary h-5 w-5" />
              Log Details
            </SheetTitle>
            <SheetDescription>
              Detailed information about the selected audit action.
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Action"
                  value={<AuditActionBadge action={selectedLog.action} />}
                />
                <DetailItem
                  label="Timestamp"
                  value={formatDateTime(selectedLog.createdAt)}
                />
                <DetailItem
                  label="Actor"
                  value={`${selectedLog.actor.name} (${selectedLog.actor.role})`}
                />
                <DetailItem label="Task ID" value={selectedLog.taskId} />
              </div>

              <div>
                <DetailItem label="Summary" value={selectedLog.summary} />
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Data Before
                </h4>
                <pre className="bg-muted max-h-[200px] overflow-auto rounded p-4 font-mono text-xs">
                  {JSON.stringify(selectedLog.beforeData || {}, null, 2)}
                </pre>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Data After
                </h4>
                <pre className="bg-muted max-h-[200px] overflow-auto rounded p-4 font-mono text-xs">
                  {JSON.stringify(selectedLog.afterData || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
        {label}
      </span>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
