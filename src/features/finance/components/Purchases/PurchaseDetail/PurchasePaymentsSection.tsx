import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { Pagination } from "@/ui/pagination";
import { CreditCard, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  usePayPurchase,
  usePurchasePayments,
} from "../../../hooks/usePurchases";
import type { PaymentDto } from "@/types";
import { PaymentMethod } from "@/types";
import AddPurchasePaymentDialog from "./AddPurchasePaymentDialog";

interface PurchasePaymentsSectionProps {
  purchaseId: number;
  isCompleted: boolean;
}

const methodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: "نقداً",
  [PaymentMethod.Card]: "بطاقة",
};

export default function PurchasePaymentsSection({
  purchaseId,
  isCompleted,
}: PurchasePaymentsSectionProps) {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 10;

  const { data: paymentsData, isLoading } = usePurchasePayments(purchaseId, {
    page,
    limit,
  });
  const payPurchaseMutation = usePayPurchase(purchaseId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const payments = paymentsData?.payments || [];
  const pagination = paymentsData?.pagination;

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_item: PaymentDto, index: number) => index + 1,
    },
    {
      key: "amount",
      header: "المبلغ",
      className: "font-mono font-semibold",
      render: (item: PaymentDto) => formatCurrency(item.amount),
    },
    {
      key: "method",
      header: "طريقة الدفع",
      render: (item: PaymentDto) =>
        item.method != null ? (
          <span>{methodLabels[item.method as PaymentMethod] || "-"}</span>
        ) : (
          <span className="text-muted-foreground/60">-</span>
        ),
    },
    {
      key: "description",
      header: "الوصف",
      render: (item: PaymentDto) =>
        item.description || <span className="text-muted-foreground/60">-</span>,
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (item: PaymentDto) => formatDate(item.createdAt),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {payments.length} دفعة
        </h3>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة دفعة
            </Button>
          )}
          <h3 className="font-semibold text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            المدفوعات
          </h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(item) => item.paymentId}
        isLoading={isLoading}
        emptyMessage="لا توجد مدفوعات لهذه الفاتورة"
      />

      <Pagination total={pagination?.total} limit={pagination?.limit} />

      <AddPurchasePaymentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(data) =>
          payPurchaseMutation.mutate(data, {
            onSuccess: () => setAddDialogOpen(false),
          })
        }
        isPending={payPurchaseMutation.isPending}
      />
    </div>
  );
}
