import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, PieChart, Pie, Cell } from "recharts";
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

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">التقارير التحليلية</h2>
        <p className="text-muted-foreground">تحليل شامل لأداء الصيدلية والمبيعات.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quick summary cards in reports */}
        {[
          { label: "نمو المبيعات", value: "+15%", icon: TrendingUp, color: "text-green-600" },
          { label: "دوران المخزون", value: "4.2x", icon: Package, color: "text-blue-600" },
          { label: "الاحتفاظ بالمرضى", value: "88%", icon: Users, color: "text-purple-600" },
          { label: "متوسط الفاتورة", value: "85 ر.س", icon: DollarSign, color: "text-teal-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>مبيعات الأشهر الستة الماضية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ textAlign: 'right' }} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع المبيعات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
