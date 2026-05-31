import { Button } from "@/ui/button";
import MetricsGrid from "./components/MetricsGrid";
import RevenueChart from "./components/RevenueChart";
import RecentSales from "./components/RecentSales";

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
  return (
    <div className="space-y-6">
      {/* HEADER */}
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

      {/* METRICS */}
      <MetricsGrid metrics={overview.metrics} />

      {/* CHART + SALES */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <RevenueChart data={overview.weeklyRevenue} />
        <RecentSales sales={overview.recentSales} />
      </div>
    </div>
  );
}
