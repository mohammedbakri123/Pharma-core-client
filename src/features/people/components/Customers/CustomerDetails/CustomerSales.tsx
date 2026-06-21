import { useState } from "react";
import { useCustomerSales } from "../../../hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Spinner } from "@/ui/spinner";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { ChevronLeft, ChevronRight, Ban } from "lucide-react";
import { DataTable } from "@/ui/data-table";

interface CustomerSalesProps {
  customerId: number;
}

export default function CustomerSales({ customerId }: CustomerSalesProps) {
  const [page, setPage] = useState(1);
  const limit = 8; // Number of items per page

  const { data, isLoading, isError, refetch } = useCustomerSales(customerId, {
    page,
    limit,
  });

  const salesResponse = data;
  const sales = salesResponse?.sales || [];
  const pagination = salesResponse?.pagination;
  const total = pagination?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">مدفوعة</Badge>;
      case "partiallypaid":
        return <Badge variant="secondary" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-transparent">مدفوعة جزئياً</Badge>;
      case "unpaid":
        return <Badge variant="destructive">غير مدفوعة</Badge>;
      case "returned":
        return <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">مرتجعة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "saleId",
      header: "رقم الفاتورة",
      render: (s: any) => <span className="font-semibold text-primary">#{s.saleId}</span>,
    },
    {
      key: "createdAt",
      header: "تاريخ الفاتورة",
      render: (s: any) => formatDate(s.createdAt),
    },
    {
      key: "userName",
      header: "البائع",
      render: (s: any) => s.userName || "-",
    },
    {
      key: "status",
      header: "حالة الفاتورة",
      render: (s: any) => getStatusBadge(s.status),
    },
    {
      key: "discount",
      header: "الخصم",
      render: (s: any) => s.discount > 0 ? `${formatCurrency(s.discount)} ر.س` : "-",
    },
    {
      key: "totalAmount",
      header: "إجمالي القيمة",
      render: (s: any) => (
        <span className="font-bold text-foreground">
          {formatCurrency(s.totalAmount)} ر.س
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive gap-2">
        <Ban className="w-8 h-8" />
        <p className="font-semibold text-sm">فشل تحميل سجل المبيعات للعميل.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <DataTable
        columns={columns}
        data={sales}
        keyExtractor={(s: any) => s.saleId}
        isLoading={isLoading}
        emptyMessage="لا يوجد سجل مبيعات لهذا العميل."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 py-2 border-t border-border/50 text-xs">
          <div className="text-muted-foreground">
            {total} فاتورة - صفحة {page} من {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // Only display around current page if there are many pages
              if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                if (p === 2 || p === totalPages - 1) {
                  return <span key={p} className="px-1 text-muted-foreground">...</span>;
                }
                return null;
              }
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  className="h-8 w-8 text-xs cursor-pointer"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
