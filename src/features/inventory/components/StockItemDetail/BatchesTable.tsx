import { DataTable } from "@/ui/data-table";
import type { Column } from "@/ui/data-table";
import { Calendar, Layers } from "lucide-react";
import type { BatchStockDto } from "../../types/inventory";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { BatchStatusBadge } from "./BatchStatusBadge";

const columns: Column<BatchStockDto>[] = [
  {
    key: "index",
    header: "#",
    className: "text-muted-foreground",
    render: (_, index) => index + 1,
  },
  {
    key: "batchNumber",
    header: "رقم الباتش",
    render: (item) =>
      item.batchNumber || <span className="text-muted-foreground/60">-</span>,
  },
  {
    key: "quantityRemaining",
    header: "الكمية",
    render: (item) => (
      <span className="font-semibold">
        <span
          className={
            item.quantityRemaining === 0
              ? "text-red-500"
              : item.quantityRemaining < 10
                ? "text-amber-500"
                : ""
          }
        >
          {item.quantityRemaining}
        </span>
        <span className="text-xs text-muted-foreground mr-1">
          / {item.quantityEntered}
        </span>
      </span>
    ),
  },
  {
    key: "purchasePrice",
    header: "سعر الشراء",
    className: "font-mono",
    render: (item) => formatCurrency(item.purchasePrice),
  },
  {
    key: "sellPrice",
    header: "سعر البيع",
    className: "font-mono font-semibold text-primary",
    render: (item) => formatCurrency(item.sellPrice),
  },
  {
    key: "expireDate",
    header: "تاريخ الانتهاء",
    render: (item) => (
      <span className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        {formatDate(item.expireDate)}
      </span>
    ),
  },
  {
    key: "status",
    header: "الحالة",
    render: (item) => <BatchStatusBadge expireDate={item.expireDate} />,
  },
];

interface BatchesTableProps {
  batches: BatchStockDto[];
}

export function BatchesTable({ batches }: BatchesTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {batches.length} باتش
        </h3>
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          تفاصيل الباتشات
        </h3>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        keyExtractor={(item) => item.batchId}
        emptyMessage="لا توجد باتشات لهذا الصنف"
      />
    </div>
  );
}
