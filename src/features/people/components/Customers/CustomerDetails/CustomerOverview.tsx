import { useCustomerDebt, useCustomerUnpaidSales } from "../../../hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Spinner } from "@/ui/spinner";
import { DollarSign, Percent, Receipt, Undo2, Ban } from "lucide-react";
import PayDebtForm from "./PayDebtForm";

interface CustomerOverviewProps {
  customerId: number;
}

export default function CustomerOverview({ customerId }: CustomerOverviewProps) {
  const { data: debtData, isLoading: isLoadingDebt, isError: isErrorDebt } = useCustomerDebt(customerId);
  const { data: unpaidSalesData, isLoading: isLoadingUnpaid, isError: isErrorUnpaid } = useCustomerUnpaidSales(customerId);

  if (isLoadingDebt || isLoadingUnpaid) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">جاري تحميل نظرة عامة...</p>
      </div>
    );
  }

  if (isErrorDebt || isErrorUnpaid || !debtData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive gap-2">
        <Ban className="w-8 h-8" />
        <p className="font-semibold text-sm">فشل تحميل البيانات المالية للعميل.</p>
      </div>
    );
  }

  const unpaidSales = unpaidSalesData?.unpaidSales || [];

  return (
    <div className="space-y-6 pt-2">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Balance / Outstanding Debt */}
        <div className="p-4 rounded-xl border border-border bg-background shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">الرصيد المتبقي (الديون)</span>
            <div className={`text-xl font-bold ${debtData.netBalance > 0 ? "text-destructive" : "text-emerald-600"}`}>
              {formatCurrency(debtData.netBalance)} ر.س
            </div>
          </div>
          <div className={`p-3 rounded-lg ${debtData.netBalance > 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-50 text-emerald-600"}`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="p-4 rounded-xl border border-border bg-background shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">إجمالي المشتريات</span>
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(debtData.totalSales)} ر.س
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Total Paid */}
        <div className="p-4 rounded-xl border border-border bg-background shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">إجمالي المدفوعات</span>
            <div className="text-xl font-bold text-emerald-600">
              {formatCurrency(debtData.totalPaid)} ر.س
            </div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Total Returns */}
        <div className="p-4 rounded-xl border border-border bg-background shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">إجمالي المرتجعات</span>
            <div className="text-xl font-bold text-amber-600">
              {formatCurrency(debtData.totalReturns)} / {debtData.totalReturns > 0 ? "ر.س" : "0"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Undo2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pay Debt Form */}
      <PayDebtForm customerId={customerId} maxAmount={debtData.netBalance} />

      {/* Unpaid Sales Table */}
      <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
        <div className="p-4 bg-muted/10 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">الفواتير غير المدفوعة أو المدفوعة جزئياً</h3>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {unpaidSales.map((sale) => (
                  <tr key={sale.saleId} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-semibold text-primary">#{sale.saleId}</td>
                    <td className="p-3 text-muted-foreground">{formatDate(sale.createdAt)}</td>
                    <td className="p-3 font-medium text-foreground">{formatCurrency(sale.totalAmount)} ر.س</td>
                    <td className="p-3 text-emerald-600">{formatCurrency(sale.paidAmount)} ر.س</td>
                    <td className="p-3 text-destructive font-bold">{formatCurrency(sale.remainingAmount)} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
