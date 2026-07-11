import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Spinner } from "@/ui/spinner";
import { CashflowPanel } from "./components/CashflowPanel";
import { DashboardHeader } from "./components/DashboardHeader";
import { InventoryPanel } from "./components/InventoryPanel";
import { KpiSummary } from "./components/KpiSummary";
import { RecentPayments } from "./components/RecentPayments";
import { RecentSalesPanel } from "./components/RecentSalesPanel";
import { SalesChart } from "./components/SalesChart";
import { type DashboardRangeKey } from "./constants";
import { useDashboardReport } from "./hooks/useDashboardReport";
import { getRangeParams } from "./utils/dashboard-formatters";

export default function Dashboard() {
  const [range, setRange] = useState<DashboardRangeKey>("week");
  const params = useMemo(() => getRangeParams(range), [range]);
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardReport(params);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div>
            <h2 className="text-lg font-bold">تعذر تحميل لوحة التحكم</h2>
            <p className="text-sm text-muted-foreground">
              تحقق من اتصال الخادم ثم أعد المحاولة.
            </p>
          </div>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader
        from={data.from}
        to={data.to}
        range={range}
        isFetching={isFetching}
        onRangeChange={setRange}
        onRefresh={() => refetch()}
      />

      <KpiSummary data={data} />

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <SalesChart data={data.dailySales} range={range} />
        <CashflowPanel cashflow={data.cashflow} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <InventoryPanel
          title="مخزون منخفض"
          count={data.inventory.lowStockCount}
          items={data.inventory.lowStockItems}
          emptyText="لا توجد أصناف منخفضة حالياً"
        />
        <InventoryPanel
          title="قريب الانتهاء"
          count={data.inventory.expiringCount}
          items={data.inventory.expiringItems}
          emptyText="لا توجد أصناف قريبة الانتهاء"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <RecentSalesPanel sales={data.recentSales} />
        <RecentPayments payments={data.recentPayments} />
      </section>
    </div>
  );
}
