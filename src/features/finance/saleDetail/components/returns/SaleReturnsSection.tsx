import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/button";
import { RotateCcw, Plus, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useSaleReturns } from "../../../common/hooks/useSalesReturns";
import { SalesReturnStatus } from "@/types";
import type { SalesReturnDto } from "@/types";
import CreateReturnDialog from "./CreateReturnDialog";
import SalesReturnStatusBadge from "../../../saleReturn/components/SalesReturnStatusBadge";

interface SaleReturnsSectionProps {
  saleId: number;
  isCompleted: boolean;
}

export default function SaleReturnsSection({
  saleId,
  isCompleted,
}: SaleReturnsSectionProps) {
  const navigate = useNavigate();
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
        <Button
          variant="link"
          className="h-auto p-0 font-medium text-primary cursor-pointer"
          onClick={() =>
            navigate(`/finance/sales/${saleId}/returns/${item.salesReturnId}`)
          }
        >
          #{item.salesReturnId}
        </Button>
      ),
    },
    {
      key: "totalAmount",
      header: "الإجمالي",
      className: "font-mono font-semibold",
      render: (item: SalesReturnDto) => formatCurrency(item.totalAmount),
    },
    {
      key: "userName",
      header: "أنشئ بواسطة",
      render: (item: SalesReturnDto) =>
        item.userName || <span className="text-muted-foreground/60">-</span>,
    },
    {
      key: "status",
      header: "الحالة",
      render: (item: SalesReturnDto) => (
        <SalesReturnStatusBadge
          status={item.status ?? SalesReturnStatus.Draft}
        />
      ),
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
    {
      key: "actions",
      header: "",
      className: "w-16 text-left",
      render: (item: SalesReturnDto) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() =>
            navigate(`/finance/sales/${saleId}/returns/${item.salesReturnId}`)
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
