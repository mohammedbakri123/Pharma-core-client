import { formatCurrency } from "@/utils/formatters";
import type React from "react";

export function SummaryTile({
  label,
  value,
  Icon,
  tone = "default",
}: {
  label: string;
  value: number | undefined;
  Icon: React.ElementType;
  tone?: "default" | "in" | "out";
}) {
  const toneClass =
    tone === "in"
      ? "bg-emerald-500/10 text-emerald-600"
      : tone === "out"
        ? "bg-rose-500/10 text-rose-600"
        : "bg-primary/10 text-primary";

  return (
    <div className="rounded-lg border border-border/50 bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-right min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold tabular-nums" dir="ltr">
            {formatCurrency(value ?? 0)} ريال
          </p>
        </div>
      </div>
    </div>
  );
}
