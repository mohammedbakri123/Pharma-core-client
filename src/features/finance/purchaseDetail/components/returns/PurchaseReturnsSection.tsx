import { useState } from "react";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { Plus, RotateCcw } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { usePurchaseReturns } from "../../../common/hooks/usePurchaseReturns";
import type { PurchaseReturnDto } from "@/types";
import CreatePurchaseReturnDialog from "../../../purchaseReturn/components/CreatePurchaseReturnDialog";

interface PurchaseReturnsSectionProps {
  purchaseId: number;
  isCompleted: boolean;
}

function getReturns(data: unknown): PurchaseReturnDto[] {
  if (Array.isArray(data)) return data as PurchaseReturnDto[];
  if (
    data &&
    typeof data === "object" &&
    "returns" in data &&
    Array.isArray((data as { returns?: unknown }).returns)
  ) {
    return (data as { returns: PurchaseReturnDto[] }).returns;
  }
  return [];
}

export default function PurchaseReturnsSection({
  purchaseId,
  isCompleted,
}: PurchaseReturnsSectionProps) {
  const { data: returnsData, isLoading } = usePurchaseReturns(purchaseId);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const returns = getReturns(returnsData);

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_item: PurchaseReturnDto, index: number) => index + 1,
    },
    {
      key: "purchaseReturnId",
      header: "رقم المرتجع",
      render: (item: PurchaseReturnDto) => (
        <span className="font-medium">#{item.purchaseReturnId}</span>
      ),
    },
    {
      key: "totalAmount",
      header: "الإجمالي",
      className: "font-mono font-semibold",
      render: (item: PurchaseReturnDto) => formatCurrency(item.totalAmount),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (item: PurchaseReturnDto) => formatDate(item.createdAt),
    },
    {
      key: "note",
      header: "ملاحظات",
      render: (item: PurchaseReturnDto) =>
        item.note || <span className="text-muted-foreground/60">-</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
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
        keyExtractor={(item) => item.purchaseReturnId}
        isLoading={isLoading}
        emptyMessage="لا توجد مرتجعات لهذه الفاتورة"
      />

      <CreatePurchaseReturnDialog
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        purchaseId={purchaseId}
      />
    </div>
  );
}
