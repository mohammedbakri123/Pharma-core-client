import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { Plus, RotateCcw, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { usePurchaseReturns } from "../../../common/hooks/usePurchaseReturns";
import { PurchaseReturnStatus } from "@/types";
import type { PurchaseReturnListItemDto } from "@/types";
import CreatePurchaseReturnDialog from "../../../purchaseReturn/components/CreatePurchaseReturnDialog";
import PurchaseReturnStatusBadge from "../../../purchaseReturn/components/PurchaseReturnStatusBadge";

interface PurchaseReturnsSectionProps {
  purchaseId: number;
  isCompleted: boolean;
}

export default function PurchaseReturnsSection({
  purchaseId,
  isCompleted,
}: PurchaseReturnsSectionProps) {
  const navigate = useNavigate();
  const { data: returnsData, isLoading } = usePurchaseReturns(purchaseId);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const returns = returnsData?.returns || [];

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: PurchaseReturnListItemDto, index: number) => index + 1,
    },
    {
      key: "purchaseReturnId",
      header: "رقم المرتجع",
      render: (item: PurchaseReturnListItemDto) => (
        <Button
          variant="link"
          className="h-auto p-0 font-medium text-primary cursor-pointer"
          onClick={() =>
            navigate(`/finance/purchases/${purchaseId}/returns/${item.purchaseReturnId}`)
          }
        >
          #{item.purchaseReturnId}
        </Button>
      ),
    },
    {
      key: "totalAmount",
      header: "الإجمالي",
      className: "font-mono font-semibold",
      render: (item: PurchaseReturnListItemDto) => formatCurrency(item.totalAmount),
    },
    {
      key: "status",
      header: "الحالة",
      render: (item: PurchaseReturnListItemDto) => (
        <PurchaseReturnStatusBadge
          status={item.status ?? PurchaseReturnStatus.Draft}
        />
      ),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (item: PurchaseReturnListItemDto) => formatDate(item.createdAt),
    },
    {
      key: "note",
      header: "ملاحظات",
      render: (item: PurchaseReturnListItemDto) =>
        item.note || <span className="text-muted-foreground/60">-</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-16 text-left",
      render: (item: PurchaseReturnListItemDto) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() =>
            navigate(`/finance/purchases/${purchaseId}/returns/${item.purchaseReturnId}`)
          }
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
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
