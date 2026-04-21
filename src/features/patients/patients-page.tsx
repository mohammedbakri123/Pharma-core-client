import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Search, Plus, Filter, Phone, Mail, MapPin } from "lucide-react";

const patients = [
  {
    id: 1,
    name: "علي محمد",
    age: 34,
    phone: "(555) 123-4567",
    email: "ali.m@email.com",
    lastVisit: "منذ يومين",
    condition: "ربو مزمن",
    status: "نشط",
  },
  {
    id: 2,
    name: "أحمد محمود",
    age: 52,
    phone: "(555) 987-6543",
    email: "ahmed.m@email.com",
    lastVisit: "منذ أسبوع",
    condition: "ارتفاع ضغط الدم",
    status: "نشط",
  },
  {
    id: 3,
    name: "سارة خالد",
    age: 28,
    phone: "(555) 456-7890",
    email: "sara.k@email.com",
    lastVisit: "منذ 3 أسابيع",
    condition: "لا يوجد",
    status: "غير نشط",
  },
  {
    id: 4,
    name: "محمد حسن",
    age: 45,
    phone: "(555) 234-5678",
    email: "mohamed.h@email.com",
    lastVisit: "أمس",
    condition: "سكري النوع الثاني",
    status: "نشط",
  },
  {
    id: 5,
    name: "ليلى يوسف",
    age: 67,
    phone: "(555) 876-5432",
    email: "layla.y@email.com",
    lastVisit: "اليوم",
    condition: "التهاب المفاصل",
    status: "نشط",
  },
  {
    id: 6,
    name: "جاسم عبدالله",
    age: 41,
    phone: "(555) 345-6789",
    email: "jasim.a@email.com",
    lastVisit: "منذ شهر",
    condition: "لا يوجد",
    status: "غير نشط",
  },
];

export default function Patients() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            المرضى
          </h2>
          <p className="text-muted-foreground">
            دليل المرضى المسجلين والسجل الطبي.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          <Plus className="w-4 h-4 ml-2" /> تسجيل مريض جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="البحث عن مرضى..." className="pr-9" />
              </div>

              <div className="space-y-2 text-right">
                <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                  الحالة
                </h3>
                <div className="flex flex-wrap gap-2 justify-start">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    الكل
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    نشط
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    غير نشط
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    جديد
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table */}
        <div className="lg:col-span-3 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-right">
                <TableHead className="text-right">المريض</TableHead>
                <TableHead className="text-right">معلومات الاتصال</TableHead>
                <TableHead className="text-right">الحالة الصحية</TableHead>
                <TableHead className="text-right">آخر زيارة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left">الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="group hover:bg-muted/50 transition-colors cursor-pointer text-right"
                >
                  <TableCell>
                    <div className="flex items-center gap-3 justify-start">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                        />
                        <AvatarFallback>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.age} سنة • معرف: #{1000 + patient.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center justify-start text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 ml-1" /> {patient.phone}
                      </div>
                      <div className="flex items-center justify-start text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 ml-1" /> {patient.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.condition !== "لا يوجد" ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-50"
                      >
                        {patient.condition}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {patient.lastVisit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-start">
                      <div
                        className={`w-2 h-2 rounded-full inline-block ml-2 ${
                          patient.status === "نشط"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm">{patient.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm">
                      عرض الملف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
