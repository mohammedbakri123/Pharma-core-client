import { DataTable } from "@/ui/data-table";
import type { Column } from "@/ui/data-table";
import { Badge } from "@/ui/badge";
import { Calendar, Hash } from "lucide-react";
import type { StockMovementItemDto } from "@/types";
import { formatDate } from "@/utils/formatters";
import {
  stockMovementTypeBadge,
  referenceTypeLabels,
} from "../Medicine/stockMovementConfig";

interface MedicineDetailMovementsTableProps {
  movements: StockMovementItemDto[];
}

export function MedicineDetailMovementsTable({
  movements,
}: MedicineDetailMovementsTableProps) {
  const columns: Column<StockMovementItemDto>[] = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-10",
      render: (_, index) => index + 1,
    },
    {
      key: "type",
      header: "النوع",
      render: (item) => {
        const config = stockMovementTypeBadge[item.type];
        return config ? (
          <Badge className={config.className}>{config.label}</Badge>
        ) : (
          <Badge variant="secondary">غير معروف</Badge>
        );
      },
    },
    {
      key: "quantity",
      header: "الكمية",
      render: (item) => (
        <span
          className={`font-semibold font-mono ${
            item.type === 2 ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {item.type === 2 ? `-${item.quantity}` : `+${item.quantity}`}
        </span>
      ),
    },
    {
      key: "referenceType",
      header: "المرجع",
      render: (item) => (
        <span className="text-sm">
          {referenceTypeLabels[item.referenceType] || "غير معروف"}
        </span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item) => (
        <span className="text-muted-foreground font-mono text-sm">
          {item.batchNumber || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (item) => (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={movements}
      keyExtractor={(item) => item.stockMovementId}
      emptyMessage="لا توجد حركات مخزنية لهذا الصنف"
    />
  );
}