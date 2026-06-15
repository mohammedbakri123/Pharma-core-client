import type React from "react";

export function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 ${className || ""}`}
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}
