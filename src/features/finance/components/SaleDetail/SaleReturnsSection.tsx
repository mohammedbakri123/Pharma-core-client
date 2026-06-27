import { useState } from "react";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/button";
import { RotateCcw, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useSaleReturns } from "../../hooks/useSalesReturns";
import type { SalesReturnDto } from "@/types";
import CreateReturnDialog from "./CreateReturnDialog";

interface SaleReturnsSectionProps {
  saleId: number;
  isCompleted: boolean;
}

export default function SaleReturnsSection({
  saleId,
  isCompleted,
}: SaleReturnsSectionProps) {
  const { data: returnsData, isLoading } = useSaleReturns(saleId);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const returns = returnsData?.returns || [];

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: SalesReturnDto, index: number) => index + 1,
    },
    {
      key: "salesReturnId",
      header: "رقم المرتجع",
      render: (item: SalesReturnDto) => (
        <span className="font-medium">#{item.salesReturnId}</span>
      ),
    },
    {
      key: "totalAmount",
      header: "الإجمالي",
      className: "font-mono font-semibold",
      render: (item: SalesReturnDto) => formatCurrency(item.totalAmount),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (item: SalesReturnDto) => formatDate(item.createdAt),
    },
    {
      key: "note",
      header: "ملاحظات",
      render: (item: SalesReturnDto) =>
        item.note || <span className="text-muted-foreground/60">-</span>,
    },
  ];

  return (
    <div>
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {returns.length} مرتجع
        </h3>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReturnDialogOpen(true)}
              className="gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إنشاء مرتجع
            </Button>
          )}
          <h3 className="font-semibold text-base flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            المرتجعات
          </h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={returns}
        keyExtractor={(item) => item.salesReturnId}
        isLoading={isLoading}
        emptyMessage="لا توجد مرتجعات لهذه الفاتورة"
      />

      <CreateReturnDialog
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        saleId={saleId}
      />
    </div>
  );
}
