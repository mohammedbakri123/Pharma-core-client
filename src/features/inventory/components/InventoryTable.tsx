import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/ui/table";

import InventoryRow from "./InventoryRow";

export default function InventoryTable({ data }: any) {
  return (
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
        {data.map((item: any) => (
          <InventoryRow key={item.id} item={item} />
        ))}
      </TableBody>
    </Table>
  );
}
