import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/ui/data-table";
import { Pagination } from "@/ui/pagination";
import { Button } from "@/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useGetSaleBalance } from "../../../../hooks/useSales";
import {
  useSalePayments,
  useAddSalePayment,
} from "@features/finance/hooks/usePayments";
import type { PaymentDto, CreateSalePaymentRequest } from "@/types";
import { PaymentMethod } from "@/types";
import { methodLabels } from "@/types";
import AddPaymentDialog from "@features/finance/components/shared/AddPaymentDialog";

import { toast } from "@/hooks/use-toast";

interface SalePaymentsSectionProps {
  saleId: number;
  isCompleted: boolean;
}

export default function SalePaymentsSection({
  saleId,
  isCompleted,
}: SalePaymentsSectionProps) {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 10;

  const { data: paymentsData, isLoading } = useSalePayments(saleId, {
    page,
    limit,
  });
  const addPaymentMutation = useAddSalePayment(saleId);
  const { data: balance } = useGetSaleBalance(saleId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const payments = paymentsData?.payments || [];
  const pagination = paymentsData?.pagination;

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: PaymentDto, index: number) => index + 1,
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
      <div className="flex flex-row-reverse items-center justify-between mb-4">
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

      <AddPaymentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(data) =>
          addPaymentMutation.mutate(data as CreateSalePaymentRequest, {
            onSuccess: () => {
              setAddDialogOpen(false);
              toast({
                title: "تمت الدفع",
                description: "تمت عملية الدفع بنجاح",
                variant: "success",
              });
            },
            onError: () => {
              toast({
                title: "فشل الدفع",
                description: "فشلت عملية الدفع حاول مجددا",

                variant: "destructive",
              });
            },
          })
        }
        isPending={addPaymentMutation.isPending}
        remainingAmount={balance?.remainingAmount}
      />
    </div>
  );
}
