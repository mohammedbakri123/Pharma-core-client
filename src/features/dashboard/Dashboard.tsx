import { useMemo, useState } from "react";
import type { ElementType } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Boxes,
  CalendarDays,
  CreditCard,
  PackageSearch,
  Plus,
  ReceiptText,
  RefreshCw,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Spinner } from "@/ui/spinner";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { cn } from "@/utils/utils";
import { useDashboardReport } from "./hooks/useDashboardReport";
import type {
  DashboardDailySales,
  DashboardReportParams,
  PaymentOverviewItem,
  SaleDto,
  StockAlertDto,
} from "./types/dashboard";

type RangeKey = "today" | "week" | "month";

const ranges: Array<{ key: RangeKey; label: string; days: number }> = [
  { key: "today", label: "اليوم", days: 1 },
  { key: "week", label: "7 أيام", days: 7 },
  { key: "month", label: "30 يوم", days: 30 },
];

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getRangeParams(range: RangeKey): DashboardReportParams {
  const days = ranges.find((item) => item.key === range)?.days ?? 7;
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days + 1);

  return {
    from: toDateParam(from),
    to: toDateParam(to),
  };
}

function formatAmount(value: number) {
  return `${formatCurrency(value)} ريال`;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Dashboard() {
  const [range, setRange] = useState<RangeKey>("week");
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

  const chartData = data.dailySales.map((item) => ({
    ...item,
    label: new Intl.DateTimeFormat("ar-SA", {
      weekday: range === "month" ? undefined : "short",
      day: "numeric",
      month: "short",
    }).format(new Date(item.date)),
  }));

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {formatDate(data.from)} - {formatDate(data.to)}
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">
              لوحة التحكم
            </h2>
            <p className="text-muted-foreground">
              متابعة فورية للمبيعات، النقدية، وتنبيهات المخزون.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-3 rounded-lg border bg-card p-1">
            {ranges.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRange(item.key)}
                className={cn(
                  "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                  range === item.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            تحديث
          </Button>
          <Button asChild>
            <Link to="/pos">
              <Plus className="h-4 w-4" />
              بيع جديد
            </Link>
          </Button>
        </div>
      </header>

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

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <div>
              <CardTitle>حركة المبيعات</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                الإيراد الصافي وعدد الفواتير حسب اليوم.
              </p>
            </div>
            <Badge variant="secondary">{ranges.find((item) => item.key === range)?.label}</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `${Number(value) / 1000}k`}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="netRevenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#dashboardRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>النقدية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CashRow
              label="القبض"
              value={data.cashflow.totalIn}
              Icon={ArrowUpRight}
              className="text-emerald-600"
            />
            <CashRow
              label="الصرف"
              value={data.cashflow.totalOut}
              Icon={ArrowDownLeft}
              className="text-rose-600"
            />
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الصافي</span>
                <strong className="text-xl tabular-nums" dir="ltr">
                  {formatAmount(data.cashflow.net)}
                </strong>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodTile label="نقداً" value={data.cashflow.cashNet} Icon={Banknote} />
              <MethodTile label="بطاقة" value={data.cashflow.cardNet} Icon={CreditCard} />
            </div>
          </CardContent>
        </Card>
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
        <RecentPaymentsPanel payments={data.recentPayments} />
      </section>
    </div>
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
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", toneClass)}>
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

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as DashboardDailySales & { label: string };

  return (
    <div className="rounded-lg border bg-card p-3 text-right shadow-lg">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-xs text-muted-foreground">الصافي</p>
      <p className="font-bold tabular-nums" dir="ltr">
        {formatAmount(item.netRevenue)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{item.totalSales} فاتورة</p>
    </div>
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
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-muted", className)}>
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

function InventoryPanel({
  title,
  count,
  items,
  emptyText,
}: {
  title: string;
  count: number;
  items: StockAlertDto[];
  emptyText: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <Badge variant={count > 0 ? "destructive" : "secondary"}>{count}</Badge>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Link
                key={`${title}-${item.medicineId}`}
                to={`/inventory/stock/${item.medicineId}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.arabicName || item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.categoryName || "بدون فئة"}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold tabular-nums">{item.totalQuantity}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.nearestExpireDate ? formatDate(item.nearestExpireDate) : "-"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentSalesPanel({ sales }: { sales: SaleDto[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>آخر المبيعات</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/finance/sales">عرض الكل</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {sales.length === 0 ? (
          <EmptyActivity text="لا توجد مبيعات مكتملة بعد" />
        ) : (
          sales.map((sale) => (
            <Link
              key={sale.saleId}
              to={`/finance/sales/${sale.saleId}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-semibold">فاتورة #{sale.saleId}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.customerName || "عميل نقدي"} · {formatTime(sale.createdAt)}
                </p>
              </div>
              <strong className="tabular-nums" dir="ltr">
                {formatAmount(sale.totalAmount - sale.discount)}
              </strong>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function RecentPaymentsPanel({ payments }: { payments: PaymentOverviewItem[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>آخر المدفوعات</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/finance/payments">عرض الكل</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.length === 0 ? (
          <EmptyActivity text="لا توجد حركات نقدية في الفترة المحددة" />
        ) : (
          payments.map((payment) => (
            <div
              key={payment.paymentId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{payment.referenceLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {payment.partyName || payment.userName || "بدون طرف"} · {formatTime(payment.createdAt)}
                </p>
              </div>
              <div className="text-left">
                <strong
                  className={cn(
                    "tabular-nums",
                    payment.type === "incoming" ? "text-emerald-600" : "text-rose-600",
                  )}
                  dir="ltr"
                >
                  {payment.type === "incoming" ? "+" : "-"}
                  {formatAmount(payment.amount)}
                </strong>
                <p className="text-xs text-muted-foreground">
                  {payment.method === "card" ? "بطاقة" : "نقداً"}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function EmptyActivity({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
      <Boxes className="h-4 w-4" />
      {text}
    </div>
  );
}
