import type { ElementType } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CreditCard,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { cn } from "@/utils/utils";
import type { DashboardCashflowSummary } from "../types/dashboard";
import { formatAmount } from "../utils/dashboard-formatters";

export function CashflowPanel({
  cashflow,
}: {
  cashflow: DashboardCashflowSummary;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>النقدية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CashRow
          label="القبض"
          value={cashflow.totalIn}
          Icon={ArrowUpRight}
          className="text-emerald-600"
        />
        <CashRow
          label="الصرف"
          value={cashflow.totalOut}
          Icon={ArrowDownLeft}
          className="text-rose-600"
        />
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">الصافي</span>
            <strong className="text-xl tabular-nums" dir="ltr">
              {formatAmount(cashflow.net)}
            </strong>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MethodTile label="نقداً" value={cashflow.cashNet} Icon={Banknote} />
          <MethodTile label="بطاقة" value={cashflow.cardNet} Icon={CreditCard} />
        </div>
      </CardContent>
    </Card>
  );
}

function CashRow({
  label,
  value,
  Icon,
  className,
}: {
  label: string;
  value: number;
  Icon: ElementType;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-muted",
            className,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <strong className="tabular-nums" dir="ltr">
        {formatAmount(value)}
      </strong>
    </div>
  );
}

function MethodTile({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: ElementType;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-bold tabular-nums" dir="ltr">
        {formatAmount(value)}
      </p>
    </div>
  );
}
