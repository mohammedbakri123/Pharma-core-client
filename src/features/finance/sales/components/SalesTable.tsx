import { SaleDto, SaleStatus, GetSalesRequest } from "@/types";
import { useSales, useCancelSale } from "../../common/hooks/useSales";
import { useToast } from "@/hooks/use-toast";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Column, DataTable } from "@/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { CardContent } from "@/ui/card";
import { Pagination } from "@/ui/pagination";
import { MoreHorizontal, Eye, XCircle, Loader2 } from "lucide-react";
import SaleStatusBadge from "./SaleStatusBadge";

export default function SalesTable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: cancelSale, isPending: isCancelling } = useCancelSale();

  const statusParam = searchParams.get("status");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const filters: GetSalesRequest = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    ...(statusParam && statusParam !== "all"
      ? { status: Number(statusParam) }
      : {}),
    ...(fromParam ? { from: fromParam } : {}),
    ...(toParam ? { to: toParam } : {}),
  };

  const { data: salesData, isLoading, isError, refetch } = useSales(filters);

  const columns: Column<SaleDto>[] = [
    {
      key: "saleId",
      header: "SalesTable#",
      render: (s) => (
        <span className="font-semibold text-foreground">#{s.saleId}</span>
      ),
    },
    {
      key: "customerId",
      header: "العميل",
      render: (s) => (
        <span className="text-muted-foreground">
          {s.customerName
            ? s.customerName
            : s.customerId
              ? `#${s.customerId}`
              : "عميل نقدي"}
        </span>
      ),
    },
    {
      key: "userId",
      header: "المستخدم",
      render: (s) => (
        <span className="text-muted-foreground">
          {s.userName
            ? s.userName
            : s.userId
              ? `#${s.userId}`
              : "مستخدم غير معروف"}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "المبلغ",
      render: (s) => (
        <span className="font-semibold text-foreground">
          {s.totalAmount.toLocaleString()} ريال
        </span>
      ),
    },
    {
      key: "discount",
      header: "الخصم",
      render: (s) => (
        <span className="text-muted-foreground">
          {s.discount > 0 ? `${s.discount.toLocaleString()} ريال` : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (s) => <SaleStatusBadge status={s.status} />,
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (s) => (
        <span className="text-muted-foreground text-sm" dir="ltr">
          {s.createdAt
            ? new Date(s.createdAt).toLocaleDateString("ar-SA")
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (s) => (
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
              onSelect={(ev) => {
                ev.preventDefault();
                navigate(`/finance/sales/${s.saleId}`);
              }}
            >
              <Eye /> عرض التفاصيل
            </DropdownMenuItem>
            {s.status === SaleStatus.Draft && (
              <DropdownMenuItem
                onSelect={(ev) => {
                  ev.preventDefault();
                  cancelSale(s.saleId, {
                    onSuccess: () => {
                      toast({
                        title: "تم إلغاء الفاتورة",
                        description: "تم إلغاء فاتورة المبيعات بنجاح.",
                        variant: "success",
                      });
                    },
                    onError: (error) => {
                      toast({
                        variant: "destructive",
                        title: "فشل إلغاء الفاتورة",
                        description:
                          error instanceof Error
                            ? error.message
                            : "حدث خطأ غير متوقع.",
                      });
                    },
                  });
                }}
                disabled={isCancelling}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                {isCancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                إلغاء
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<SaleDto>
        columns={columns}
        data={salesData?.sales || []}
        keyExtractor={(s) => s.saleId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على فواتير المبيعات. حاول إضافة فاتورة جديدة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      <Pagination
        limit={salesData?.pagination.limit}
        total={salesData?.pagination.total}
      />
    </CardContent>
  );
}
