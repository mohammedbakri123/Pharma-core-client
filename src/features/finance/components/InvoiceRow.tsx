import { TableRow, TableCell } from "@/ui/table";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Eye, Download } from "lucide-react";

export default function InvoiceRow({ inv }: any) {
  return (
    <TableRow>
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
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
