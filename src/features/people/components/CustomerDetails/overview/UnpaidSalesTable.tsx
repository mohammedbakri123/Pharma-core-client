import type { UnpaidSaleDto } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface UnpaidSalesTableProps {
  unpaidSales: UnpaidSaleDto[];
}

export default function UnpaidSalesTable({ unpaidSales }: UnpaidSalesTableProps) {
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
