import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UnpaidSaleDto, CreatePaymentInput } from "@/types";
import { PaymentReferenceType } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button } from "@/ui/button";
import { CreditCard } from "lucide-react";
import AddPaymentDialog from "@features/finance/common/components/AddPaymentDialog";
import { createPayment } from "@features/finance/common/api/payments";
import { useToast } from "@/hooks/use-toast";

interface UnpaidSalesTableProps {
  unpaidSales: UnpaidSaleDto[];
  customerId: number;
}

export default function UnpaidSalesTable({ unpaidSales, customerId }: UnpaidSalesTableProps) {
  const [selectedSale, setSelectedSale] = useState<UnpaidSaleDto | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentInput & { saleId: number }) =>
      createPayment({
        ...data,
        referenceType: PaymentReferenceType.Sale,
        referenceId: data.saleId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", customerId, "unpaid-sales"] });
      queryClient.invalidateQueries({ queryKey: ["customers", customerId, "debt"] });
      queryClient.invalidateQueries({ queryKey: ["customers", customerId] });
      setSelectedSale(null);
      toast({
        title: "تمت الدفع",
        description: "تم تسجيل الدفعة بنجاح",
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
  });

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
      <div className="p-4 bg-muted/10 border-b border-border/60 flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">
          الفواتير غير المدفوعة أو المدفوعة جزئياً
        </h3>
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
          {unpaidSales.length} فواتير معلقة
        </span>
      </div>
      <div className="overflow-x-auto" dir="rtl">
        {unpaidSales.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            لا توجد فواتير غير مدفوعة لهذا العميل.
          </div>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-muted/40 text-xs text-muted-foreground border-b border-border">
                <th className="p-3 font-semibold">رقم الفاتورة</th>
                <th className="p-3 font-semibold">تاريخ الفاتورة</th>
                <th className="p-3 font-semibold">إجمالي قيمة الفاتورة</th>
                <th className="p-3 font-semibold">المبلغ المدفوع</th>
                <th className="p-3 font-semibold">المبلغ المتبقي</th>
                <th className="p-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {unpaidSales.map((sale) => (
                <tr
                  key={sale.saleId}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="p-3 font-semibold text-primary">
                    #{sale.saleId}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {formatCurrency(sale.totalAmount)} ر.س
                  </td>
                  <td className="p-3 text-emerald-600">
                    {formatCurrency(sale.paidAmount)} ر.س
                  </td>
                  <td className="p-3 text-destructive font-bold">
                    {formatCurrency(sale.remainingAmount)} ر.س
                  </td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSale(sale)}
                      className="gap-1 text-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      دفع
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddPaymentDialog
        open={!!selectedSale}
        onOpenChange={(open) => { if (!open) setSelectedSale(null); }}
        onAdd={(data) =>
          addPaymentMutation.mutate({
            ...data,
            saleId: selectedSale!.saleId,
          } as CreatePaymentInput & { saleId: number })
        }
        isPending={addPaymentMutation.isPending}
        remainingAmount={selectedSale?.remainingAmount}
      />
    </div>
  );
}
