import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";

const invoices = [
  { id: "INV-2024-001", patient: "علي محمد", date: "2024-01-20", amount: "150.00 ر.س", status: "مدفوعة" },
  { id: "INV-2024-002", patient: "أحمد محمود", date: "2024-01-21", amount: "45.00 ر.س", status: "مدفوعة" },
  { id: "INV-2024-003", patient: "سارة خالد", date: "2024-01-21", amount: "210.20 ر.س", status: "مسودة" },
  { id: "INV-2024-004", patient: "محمد حسن", date: "2024-01-22", amount: "85.00 ر.س", status: "مدفوعة" },
];

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">الفواتير</h2>
          <p className="text-muted-foreground">إدارة سجل الفواتير والمقبوضات.</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 ml-2" /> فاتورة جديدة
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>رقم الفاتورة</TableHead>
              <TableHead>المريض</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>المبلغ الإجمالي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                <TableCell className="font-medium">{inv.patient}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell className="font-bold">{inv.amount}</TableCell>
                <TableCell>
                  <Badge variant={inv.status === "مدفوعة" ? "default" : "secondary"}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
