"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuditLogWithRelations } from "@/types";
import { cn, formatRelative, getInitials } from "@/utils";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";
import { AuditActionBadge } from "./AuditActionBadge";

interface AuditLogTimelineProps {
  logs: AuditLogWithRelations[];
}

export function AuditLogTimeline({ logs }: AuditLogTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-muted/30 text-muted-foreground flex flex-col items-center justify-center rounded border border-dashed p-12">
        <Clock className="mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm">No activity recorded for this task yet.</p>
      </div>
    );
  }

  return (
    <div className="before:bg-border relative space-y-8 pl-8 before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-[2px]">
      {logs.map((log) => (
        <TimelineItem key={log.id} log={log} />
      ))}
    </div>
  );
}

function TimelineItem({ log }: { log: AuditLogWithRelations }) {
  const [showChanges, setShowChanges] = useState(false);

  const hasChanges = log.beforeData || log.afterData;

  return (
    <div className="relative">
      {/* Icon/Avatar */}
      <div className="absolute top-0 -left-[41px] flex items-center justify-center">
        <Avatar className="border-background ring-background h-9 w-9 border-2 ring-4">
          <AvatarFallback
            className={cn(
              "text-[10px] font-bold",
              log.actor.role === "ADMIN"
                ? "bg-violet-500/10 text-violet-400"
                : "bg-zinc-500/10 text-zinc-400",
            )}
          >
            {getInitials(log.actor.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-foreground text-sm font-semibold">
              {log.actor.name}
            </span>
            <AuditActionBadge action={log.action} />
          </div>
          <span className="text-muted-foreground shrink-0 text-xs tracking-wider uppercase">
            {formatRelative(log.createdAt)}
          </span>
        </div>

        <p className="text-muted-foreground text-sm">{log.summary}</p>

        {hasChanges && (
          <div className="pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/5 h-7 px-2 text-xs"
              onClick={() => setShowChanges(!showChanges)}
            >
              {showChanges ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Hide changes
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Show changes
                </>
              )}
            </Button>

            {showChanges && (
              <div className="animate-in fade-in slide-in-from-top-1 mt-2 grid grid-cols-1 gap-4 duration-200 sm:grid-cols-2">
                <div className="rounded border border-red-500/10 bg-red-500/5 p-3">
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-red-400/70 uppercase">
                    Before
                  </p>
                  <pre className="text-muted-foreground overflow-x-auto font-mono text-xs">
                    {JSON.stringify(log.beforeData || {}, null, 2)}
                  </pre>
                </div>
                <div className="rounded border border-emerald-500/10 bg-emerald-500/5 p-3">
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-emerald-400/70 uppercase">
                    After
                  </p>
                  <pre className="text-muted-foreground overflow-x-auto font-mono text-xs">
                    {JSON.stringify(log.afterData || {}, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
