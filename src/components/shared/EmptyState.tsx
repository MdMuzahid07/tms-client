import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center">
      <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded">
        <Icon className="text-muted-foreground h-6 w-6" />
      </div>
      <h3 className="text-foreground text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 mb-6 max-w-[300px] text-sm">
        {description}
      </p>
      {action && action}
    </div>
  );
}
