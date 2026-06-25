import { PurchaseDto, PurchaseStatus } from "@/types";
import { useCancelPurchase, usePurchases } from "../../hooks/usePurchases";
import { useToast } from "@/hooks/use-toast";

import { useSearchParams } from "react-router-dom";
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
import {
  FileText,
  Loader2,
  MoreHorizontal,
  ReceiptText,
  XCircle,
} from "lucide-react";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

export default function PurchasesTable() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const { mutate: cancelPurchase, isPending: isCancelling } =
    useCancelPurchase();

  const statusParam = searchParams.get("status");
  const supplierParam = searchParams.get("supplierId");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const filters = {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    ...(supplierParam ? { supplierId: Number(supplierParam) } : {}),
    ...(statusParam && statusParam !== "all"
      ? { status: Number(statusParam) }
      : {}),
    ...(fromParam ? { from: fromParam } : {}),
    ...(toParam ? { to: toParam } : {}),
  };

  const {
    data: purchasesData,
    isLoading,
    isError,
    refetch,
  } = usePurchases(filters);

  const columns: Column<PurchaseDto>[] = [
    {
      key: "purchaseId",
      header: "PurchasesTable#",
      render: (p) => (
        <span className="font-semibold text-foreground">#{p.purchaseId}</span>
      ),
    },
    {
      key: "supplierId",
      header: "المورد",
      render: (p) => (
        <span className="text-muted-foreground">
          {p.supplierName
            ? p.supplierName
            : p.supplierId
              ? `#${p.supplierId}`
              : "مورد غير محدد"}
        </span>
      ),
    },
    {
      key: "invoiceNumber",
      header: "رقم الفاتورة",
      render: (p) => (
        <span className="text-muted-foreground">
          {p.invoiceNumber ? (
            <span className="inline-flex items-center gap-1" dir="ltr">
              <ReceiptText className="w-4 h-4" />
              {p.invoiceNumber}
            </span>
          ) : (
            "-"
          )}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "المبلغ",
      render: (p) => (
        <span className="font-semibold text-foreground">
          {p.totalAmount.toLocaleString()} ريال
        </span>
      ),
    },
    {
      key: "note",
      header: "الملاحظة",
      render: (p) => (
        <span className="text-muted-foreground">
          {p.note ? (
            <span className="inline-flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {p.note}
            </span>
          ) : (
            "-"
          )}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (p) => <PurchaseStatusBadge status={p.status} />,
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (p) => (
        <span className="text-muted-foreground text-sm" dir="ltr">
          {p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("ar-SA")
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      headerClassName: "text-center",
      className: "text-center",
      render: (p) => (
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
            {p.status === PurchaseStatus.Draft && (
              <DropdownMenuItem
                onSelect={(ev) => {
                  ev.preventDefault();
                  cancelPurchase(p.purchaseId, {
                    onSuccess: () => {
                      toast({
                        title: "تم إلغاء الفاتورة",
                        description: "تم إلغاء فاتورة المشتريات بنجاح.",
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
            {p.status !== PurchaseStatus.Draft && (
              <DropdownMenuItem disabled>لا توجد إجراءات</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CardContent className="pt-6">
      <DataTable<PurchaseDto>
        columns={columns}
        data={purchasesData?.purchases || []}
        keyExtractor={(p) => p.purchaseId}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyMessage="لم يتم العثور على فواتير المشتريات. حاول إضافة فاتورة جديدة."
        emptySearchMessage="لا توجد نتائج مطابقة لبحثك"
      />

      <Pagination
        limit={purchasesData?.pagination.limit}
        total={purchasesData?.pagination.total}
      />
    </CardContent>
  );
}
