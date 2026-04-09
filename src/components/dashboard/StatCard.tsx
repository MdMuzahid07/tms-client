import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "indigo" | "amber" | "blue" | "emerald";
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorStyles = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    amber: "bg-amber-500/10 text-amber-400",
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <Card className="bg-card/50 hover:bg-card rounded border transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <h3 className="text-foreground text-2xl font-bold tracking-tight">
              {value}
            </h3>
          </div>
          <div className={cn("rounded p-3", colorStyles[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
