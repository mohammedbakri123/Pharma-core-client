import ReportHeader from "./components/ReportHeader";
import StatsCards from "./components/StatsCards";
import SalesChart from "./components/SalesChart";
import CategoryChart from "./components/CategoryChart";

import { TrendingUp, Package, Users, DollarSign } from "lucide-react";

const salesData = [
  { name: "يناير", value: 4000 },
  { name: "فبراير", value: 3000 },
  { name: "مارس", value: 2000 },
  { name: "أبريل", value: 2780 },
  { name: "مايو", value: 1890 },
  { name: "يونيو", value: 2390 },
];

const categoryData = [
  { name: "مضادات حيوية", value: 400 },
  { name: "مسكنات", value: 300 },
  { name: "مكملات", value: 300 },
  { name: "أخرى", value: 200 },
];

const COLORS = ["#0D9488", "#3B82F6", "#F59E0B", "#EF4444"];

const stats = [
  {
    label: "نمو المبيعات",
    value: "+15%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    label: "دوران المخزون",
    value: "4.2x",
    icon: Package,
    color: "text-blue-600",
  },
  {
    label: "الاحتفاظ بالمرضى",
    value: "88%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    label: "متوسط الفاتورة",
    value: "85 ر.س",
    icon: DollarSign,
    color: "text-teal-600",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <ReportHeader />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} />
        <CategoryChart data={categoryData} colors={COLORS} />
      </div>
    </div>
  );
}
