import { useState } from "react";
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
import { Badge } from "@/ui/badge";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

const inventoryData = [
  {
    id: 1,
    name: "أموكسيسيلين 500 ملغ",
    sku: "MED-001",
    category: "مضادات حيوية",
    stock: 450,
    minLevel: 100,
    price: 12.5,
    expiry: "2026-10-15",
    status: "متوفر",
  },
  {
    id: 2,
    name: "ايبوبروفين 400 ملغ",
    sku: "MED-002",
    category: "مسكنات آلام",
    stock: 1200,
    minLevel: 200,
    price: 8.99,
    expiry: "2027-01-20",
    status: "متوفر",
  },
  {
    id: 3,
    name: "ليزينوبريل 10 ملغ",
    sku: "MED-003",
    category: "أمراض القلب",
    stock: 45,
    minLevel: 50,
    price: 15.0,
    expiry: "2026-05-12",
    status: "مخزون منخفض",
  },
  {
    id: 4,
    name: "ميتفورمين 500 ملغ",
    sku: "MED-004",
    category: "السكري",
    stock: 800,
    minLevel: 150,
    price: 5.5,
    expiry: "2026-08-30",
    status: "متوفر",
  },
  {
    id: 5,
    name: "أطورفاستاتين 20 ملغ",
    sku: "MED-005",
    category: "أمراض القلب",
    stock: 20,
    minLevel: 40,
    price: 22.0,
    expiry: "2025-12-05",
    status: "حرج",
  },
  {
    id: 6,
    name: "أوميبرازول 20 ملغ",
    sku: "MED-006",
    category: "الجهاز الهضمي",
    stock: 300,
    minLevel: 80,
    price: 18.75,
    expiry: "2026-11-01",
    status: "متوفر",
  },
  {
    id: 7,
    name: "بخاخ ألبوتيرول",
    sku: "MED-007",
    category: "الجهاز التنفسي",
    stock: 0,
    minLevel: 30,
    price: 45.0,
    expiry: "2025-09-15",
    status: "متوفر",
  },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            المخزون
          </h2>
          <p className="text-muted-foreground">
            إدارة مخزون الأدوية وتواريخ انتهاء الصلاحية.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md">
          <Plus className="w-4 h-4 ml-2" /> إضافة صنف جديد
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث بالاسم أو SKU..."
              className="pr-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="text-muted-foreground">
            <Filter className="w-4 h-4 ml-2" /> تصفية
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 text-right">
              <TableHead className="text-right">SKU</TableHead>
              <TableHead className="text-right">اسم المنتج</TableHead>
              <TableHead className="text-right">الفئة</TableHead>
              <TableHead className="text-center">مستوى المخزون</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">تاريخ الانتهاء</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/50 transition-colors text-right"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.sku}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold">{item.stock}</span>
                    <span className="text-[10px] text-muted-foreground">
                      الحد الأدنى: {item.minLevel}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.price.toFixed(2)} ر.س</TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {item.expiry}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.status === "متوفر"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 border-green-200"
                        : item.status === "مخزون منخفض"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100 border-yellow-200"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 border-red-200"
                    }
                  >
                    {item.status === "متوفر" ? (
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 ml-1" />
                    )}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel className="text-right">
                        الإجراءات
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="text-right">
                        تعديل التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-right">
                        تحديث المخزون
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-right">
                        عرض السجل
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive text-right">
                        حذف الصنف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
