import { StockAlertDto, GetStockAlertQuery } from "@/types";
import { useStockAlerts } from "@features/inventory/hooks/useInventory";

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Column, DataTable } from "@/ui/data-table";
import MedicineUnitBadge from "../Medicine/MedicineUnitBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";
import { Badge } from "@/ui/badge";

export default function InventoryTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const expiringDays = searchParams.get("expiringDays");
  const lowStock = searchParams.get("lowStock");

  const filters: GetStockAlertQuery = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    search: searchParams.get("search") ?? null,
    ExpiringDays:
      expiringDays && expiringDays !== "all" ? Number(expiringDays) : null,
    LowStockThreshold: lowStock && lowStock !== "all" ? Number(lowStock) : null,
  };

  const {
    data: stockData,
    isLoading,
    isError,
    refetch,
  } = useStockAlerts(filters);
  console.log("Stock Alert Data:", stockData, "Filters:", filters);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      متوفر: "bg-green-600 hover:bg-green-600/95 text-white",
      "مخزون منخفض": "bg-amber-600 hover:bg-amber-600/95 text-white",
      حرج: "bg-red-600 hover:bg-red-600/95 text-white",
    };
    return <Badge className={colors[status] || ""}>{status}</Badge>;
  };

  const columns: Column<StockAlertDto>[] = [
    {
      key: "arabicName",
      header: "الاسم",
      render: (item) => (
        <span className="font-semibold text-foreground flex items-center gap-2">
          {item.arabicName || item.name}
        </span>
      ),
    },
    {
      key: "barcode",
      header: "الباركود",
      className: "text-muted-foreground font-mono text-xs",
      render: (item) => item.barcode || "-",
    },
    {
      key: "categoryName",
      header: "الفئة",
      className: "text-muted-foreground",
      render: (item) => item.categoryName || "-",
    },
    {
      key: "unit",
      header: "الوحدة",
      render: (item) => <MedicineUnitBadge unit={item.unit} />,
    },
    {
      key: "totalQuantity",
      header: "الكمية",
      render: (item) => (
        <span className="font-semibold">{item.totalQuantity}</span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (item) => statusBadge(item.status),
    },
    {
      key: "nearestExpireDate",
      header: "أقرب تاريخ انتهاء",
      render: (item) => item.nearestExpireDate || "-",
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (item) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8 shrink-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                navigate(`/inventory/stock/${item.medicineId}`);
              }}
            >
              <Eye className="w-4 h-4 ml-2" /> عرض التفاصيل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<StockAlertDto>
        columns={columns}
        data={stockData?.items || []}
        keyExtractor={(item) => item.medicineId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على مخزون. حاول إضافة أصناف جديدة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />
      <Pagination
        limit={stockData?.pagination.limit}
        total={stockData?.pagination.total}
      />
    </CardContent>
  );
}
