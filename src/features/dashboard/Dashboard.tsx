import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const overview = {
  metrics: [
    {
      label: "إجمالي الإيرادات",
      value: "12,450.20 ر.س",
      trend: "+12% منذ الشهر الماضي",
      trendDirection: "up",
    },
    {
      label: "الوصفات المصروفة",
      value: "+573",
      trend: "+8% منذ الشهر الماضي",
      trendDirection: "up",
    },
    {
      label: "تنبيهات انخفاض المخزون",
      value: "12",
      trend: "أصناف تحت الحد الأدنى",
      trendDirection: "neutral",
    },
    {
      label: "المرضى النشطون",
      value: "2,340",
      trend: "-2% منذ الشهر الماضي",
      trendDirection: "down",
    },
  ],
  weeklyRevenue: [
    { name: "الإثنين", total: 1200 },
    { name: "الثلاثاء", total: 2100 },
    { name: "الأربعاء", total: 1800 },
    { name: "الخميس", total: 2400 },
    { name: "الجمعة", total: 3200 },
    { name: "السبت", total: 3800 },
    { name: "الأحد", total: 2600 },
  ],
  recentSales: [
    {
      id: "INV001",
      patient: "علي محمد",
      amount: "124.50 ر.س",
      status: "مكتمل",
      time: "10:24 ص",
    },
    {
      id: "INV002",
      patient: "أحمد محمود",
      amount: "45.00 ر.س",
      status: "مكتمل",
      time: "10:45 ص",
    },
    {
      id: "INV003",
      patient: "سارة خالد",
      amount: "210.20 ر.س",
      status: "قيد الانتظار",
      time: "11:02 ص",
    },
    {
      id: "INV004",
      patient: "محمد حسن",
      amount: "85.00 ر.س",
      status: "مكتمل",
      time: "11:15 ص",
    },
    {
      id: "INV005",
      patient: "ليلى يوسف",
      amount: "12.99 ر.س",
      status: "مسترجع",
      time: "11:30 ص",
    },
  ],
};

export default function Dashboard() {
  const metricIcons = [DollarSign, Package, AlertTriangle, Users];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            لوحة التحكم
          </h2>
          <p className="text-muted-foreground">
            نظرة عامة على أداء الصيدلية لهذا اليوم.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تحميل التقرير</Button>
          <Button>إنهاء الوردية</Button>
        </div>
      </div>
      {/* 
      {isUsingFallback ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          يتم عرض بيانات تجريبية مؤقتا حتى يتم ربط نقاط نهاية لوحة التحكم في
          خدمة .NET.
        </div>
      ) : null} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overview.metrics.map((metric, index) => {
          const Icon = metricIcons[index] ?? DollarSign;
          const TrendIcon =
            metric.trendDirection === "up"
              ? TrendingUp
              : metric.trendDirection === "down"
              ? TrendingDown
              : null;
          const trendClassName =
            metric.trendDirection === "up"
              ? "text-green-600"
              : metric.trendDirection === "down"
              ? "text-red-500"
              : "text-muted-foreground";

          return (
            <Card
              key={metric.label}
              className={
                metric.trendDirection === "neutral"
                  ? "hover:shadow-md transition-shadow duration-200 border-r-4 border-r-yellow-400"
                  : "hover:shadow-md transition-shadow duration-200"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Icon
                  className={
                    metric.trendDirection === "neutral"
                      ? "h-4 w-4 text-yellow-500"
                      : "h-4 w-4 text-muted-foreground"
                  }
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <span className={trendClassName + " ml-1 flex items-center"}>
                    {TrendIcon ? (
                      <TrendIcon className="mr-0.5 h-3 w-3" />
                    ) : null}
                  </span>
                  {metric.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>الإيرادات الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent className="pr-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.weeklyRevenue}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      textAlign: "right",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>أحدث المعاملات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {overview.recentSales.map((sale, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {sale.patient.charAt(0)}
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium leading-none">
                        {sale.patient}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.id} • {sale.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{sale.amount}</p>
                    <Badge
                      variant={
                        sale.status === "مكتمل"
                          ? "default"
                          : sale.status === "قيد الانتظار"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] h-5 px-1.5"
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
