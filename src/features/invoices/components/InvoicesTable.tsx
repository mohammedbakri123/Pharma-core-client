import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/ui/table";

import InvoiceRow from "./InvoiceRow";

export default function InvoicesTable({ data }: any) {
  return (
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
          {data.map((inv: any) => (
            <InvoiceRow key={inv.id} inv={inv} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
