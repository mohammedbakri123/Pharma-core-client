import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconClassName?: string;
  valueClassName?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  iconClassName = "bg-primary/10 text-primary",
  valueClassName = "text-foreground",
}: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background shadow-xs flex items-center justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <div className={`text-xl font-bold ${valueClassName}`}>
          {value}
        </div>
      </div>
      <div className={`p-3 rounded-lg ${iconClassName}`}>
        {icon}
      </div>
    </div>
  );
}
