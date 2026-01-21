import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Users 
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "الإثنين", total: 1200 },
  { name: "الثلاثاء", total: 2100 },
  { name: "الأربعاء", total: 1800 },
  { name: "الخميس", total: 2400 },
  { name: "الجمعة", total: 3200 },
  { name: "السبت", total: 3800 },
  { name: "الأحد", total: 2600 },
];

const recentSales = [
  { id: "INV001", patient: "علي محمد", amount: "124.50 ر.س", status: "مكتمل", time: "10:24 ص" },
  { id: "INV002", patient: "أحمد محمود", amount: "45.00 ر.س", status: "مكتمل", time: "10:45 ص" },
  { id: "INV003", patient: "سارة خالد", amount: "210.20 ر.س", status: "قيد الانتظار", time: "11:02 ص" },
  { id: "INV004", patient: "محمد حسن", amount: "85.00 ر.س", status: "مكتمل", time: "11:15 ص" },
  { id: "INV005", patient: "ليلى يوسف", amount: "12.99 ر.س", status: "مسترجع", time: "11:30 ص" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">لوحة التحكم</h2>
          <p className="text-muted-foreground">نظرة عامة على أداء الصيدلية لهذا اليوم.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تحميل التقرير</Button>
          <Button>إنهاء الوردية</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450.20 ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-600 flex items-center ml-1">
                +12% <TrendingUp className="h-3 w-3 mr-0.5" />
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الوصفات المصروفة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-600 flex items-center ml-1">
                +8% <TrendingUp className="h-3 w-3 mr-0.5" />
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-r-4 border-r-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">تنبيهات انخفاض المخزون</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              أصناف تحت الحد الأدنى
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المرضى النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,340</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-red-500 flex items-center ml-1">
                -2% <TrendingDown className="h-3 w-3 mr-0.5" />
              </span>
              منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>الإيرادات الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent className="pr-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'right' }}
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
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {sale.patient.charAt(0)}
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium leading-none">{sale.patient}</p>
                      <p className="text-xs text-muted-foreground">{sale.id} • {sale.time}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{sale.amount}</p>
                    <Badge variant={sale.status === "مكتمل" ? "default" : sale.status === "قيد الانتظار" ? "secondary" : "destructive"} className="text-[10px] h-5 px-1.5">
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
