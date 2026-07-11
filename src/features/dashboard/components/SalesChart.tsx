import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { dashboardRanges, type DashboardRangeKey } from "../constants";
import type { DashboardDailySales } from "../types/dashboard";
import {
  formatAmount,
  formatChartLabel,
} from "../utils/dashboard-formatters";

interface SalesChartProps {
  data: DashboardDailySales[];
  range: DashboardRangeKey;
}

export function SalesChart({ data, range }: SalesChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatChartLabel(item.date, range),
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>حركة المبيعات</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            الإيراد الصافي وعدد الفواتير حسب اليوم.
          </p>
        </div>
        <Badge variant="secondary">
          {dashboardRanges.find((item) => item.key === range)?.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="dashboardRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.34}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
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
      <p className="mt-1 text-xs text-muted-foreground">
        {item.totalSales} فاتورة
      </p>
    </div>
  );
}
