import { useState } from "react";
import { useCustomerSales } from "../../../hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button } from "@/ui/button";
import { Ban } from "lucide-react";
import { DataTable } from "@/ui/data-table";
import type { Column } from "@/ui/data-table";
import type { SaleListItemDto } from "@/types";
import SaleStatusBadge from "./SaleStatusBadge";
import SalesPagination from "./SalesPagination";

interface CustomerSalesProps {
  customerId: number;
}

export default function CustomerSales({ customerId }: CustomerSalesProps) {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, isError, refetch } = useCustomerSales(customerId, {
    page,
    limit,
  });

  const salesResponse = data;
  const sales = salesResponse?.sales || [];
  const pagination = salesResponse?.pagination;
  const total = pagination?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const columns: Column<SaleListItemDto>[] = [
    {
      key: "saleId",
      header: "رقم الفاتورة",
      render: (s) => <span className="font-semibold text-primary">#{s.saleId}</span>,
    },
    {
      key: "createdAt",
      header: "تاريخ الفاتورة",
      render: (s) => formatDate(s.createdAt),
    },
    {
      key: "userName",
      header: "البائع",
      render: (s) => s.userName || "-",
    },
    {
      key: "status",
      header: "حالة الفاتورة",
      render: (s) => <SaleStatusBadge status={s.status} />,
    },
    {
      key: "discount",
      header: "الخصم",
      render: (s) => s.discount > 0 ? `${formatCurrency(s.discount)} ر.س` : "-",
    },
    {
      key: "totalAmount",
      header: "إجمالي القيمة",
      render: (s) => (
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
      <DataTable<SaleListItemDto>
        columns={columns}
        data={sales}
        keyExtractor={(s) => s.saleId}
        isLoading={isLoading}
        emptyMessage="لا يوجد سجل مبيعات لهذا العميل."
      />

      <SalesPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
