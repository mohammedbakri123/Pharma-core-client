import type { ElementType } from "react";
import {
  PackageSearch,
  ReceiptText,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Card, CardContent } from "@/ui/card";
import { cn } from "@/utils/utils";
import type { DashboardReport } from "../types/dashboard";
import { formatAmount } from "../utils/dashboard-formatters";

export function KpiSummary({ data }: { data: DashboardReport }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="صافي المبيعات"
        value={formatAmount(data.sales.netRevenue)}
        detail={`${data.sales.totalSales} فاتورة مكتملة`}
        Icon={TrendingUp}
        tone="emerald"
      />
      <KpiCard
        label="صافي النقدية"
        value={formatAmount(data.cashflow.net)}
        detail={`قبض ${formatAmount(data.cashflow.totalIn)}`}
        Icon={WalletCards}
        tone="blue"
      />
      <KpiCard
        label="متوسط الفاتورة"
        value={formatAmount(data.sales.averageSale)}
        detail={`خصومات ${formatAmount(data.sales.totalDiscount)}`}
        Icon={ReceiptText}
        tone="slate"
      />
      <KpiCard
        label="تنبيهات المخزون"
        value={`${data.inventory.lowStockCount + data.inventory.expiringCount}`}
        detail={`${data.inventory.lowStockCount} منخفض · ${data.inventory.expiringCount} انتهاء قريب`}
        Icon={PackageSearch}
        tone="amber"
      />
    </section>
  );
}

function KpiCard({
  label,
  value,
  detail,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: ElementType;
  tone: "emerald" | "blue" | "slate" | "amber";
}) {
  const toneClass = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-sky-500/10 text-sky-600",
    slate: "bg-slate-500/10 text-slate-600",
    amber: "bg-amber-500/10 text-amber-600",
  }[tone];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
              toneClass,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-xl font-bold tabular-nums" dir="ltr">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
