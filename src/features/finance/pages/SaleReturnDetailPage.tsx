import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Coins,
  Wallet,
  Banknote,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { DataTable } from "@/ui/data-table";
import { StatCard } from "@/ui/stat-card";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { SalesReturnStatus } from "@/types";
import type { SalesReturnItemDto } from "@/types";

import {
  useSaleReturnById,
  useGetSaleReturnBalance,
  useAddSaleReturnItem,
  useUpdateSaleReturnItem,
  useDeleteSaleReturnItem,
  useCompleteSaleReturn,
  useCancelSaleReturn,
} from "../hooks/useSalesReturns";
import { useGetSale } from "../hooks/useSales";

import SalesReturnStatusBadge from "../components/SaleDetail/SalesReturnDetail/SalesReturnStatusBadge";
import AddReturnItemDialog from "../components/SaleDetail/SalesReturnDetail/AddReturnItemDialog";
import EditReturnItemDialog from "../components/SaleDetail/SalesReturnDetail/EditReturnItemDialog";

export default function SaleReturnDetailPage() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const saleId = Number(id);
  const retId = Number(returnId);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesReturnItemDto | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Queries
  const {
    data: salesReturn,
    isLoading: returnLoading,
    isError: returnError,
    refetch: refetchReturn,
  } = useSaleReturnById(saleId, retId);

  const { data: sale, isLoading: saleLoading } = useGetSale(saleId);
  const { data: balance, isLoading: balanceLoading } = useGetSaleReturnBalance(
    saleId,
    retId
  );

  // Mutations
  const { mutate: addReturnItem, isPending: isAdding } = useAddSaleReturnItem(
    saleId,
    retId
  );
  const { mutate: updateReturnItem, isPending: isUpdating } = useUpdateSaleReturnItem(
    saleId,
    retId
  );
  const { mutate: deleteReturnItem, isPending: isDeleting } = useDeleteSaleReturnItem(
    saleId,
    retId
  );
  const { mutate: completeReturn, isPending: isCompleting } = useCompleteSaleReturn(
    saleId
  );
  const { mutate: cancelReturn, isPending: isCancelling } = useCancelSaleReturn(
    saleId
  );

  const isLoading = returnLoading || saleLoading || balanceLoading;
  const isError = returnError || !salesReturn || !sale;

  if (isLoading) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">جاري تحميل تفاصيل المرتجع...</p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل بيانات المرتجع</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetchReturn()}>
              إعادة المحاولة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/finance/sales/${saleId}/returns`)}
            >
              العودة لقائمة المرتجعات
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const isDraft = salesReturn.status === SalesReturnStatus.Draft;

  // Complete return handler
  const handleCompleteReturn = () => {
    completeReturn(retId, {
      onSuccess: () => {
        setCompleteDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["sale", saleId, "returns", retId],
        });
        queryClient.invalidateQueries({
          queryKey: ["sale", saleId, "returns", retId, "balance"],
        });
        toast({
          title: "تم إكمال المرتجع",
          description: "تم إكمال المرتجع وتحديث المخزون بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل إكمال المرتجع",
          description: "حدث خطأ أثناء إكمال المرتجع. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      },
    });
  };

  // Cancel return handler
  const handleCancelReturn = () => {
    cancelReturn(retId, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        toast({
          title: "تم إلغاء المرتجع",
          description: "تم إلغاء المرتجع بنجاح.",
          variant: "success",
        });
        navigate(`/finance/sales/${saleId}/returns`);
      },
      onError: () => {
        toast({
          title: "فشل إلغاء المرتجع",
          description: "حدث خطأ أثناء إلغاء المرتجع.",
          variant: "destructive",
        });
      },
    });
  };

  // Delete item handler
  const handleDeleteItem = () => {
    if (deletingItemId === null) return;
    deleteReturnItem(deletingItemId, {
      onSuccess: () => {
        setDeletingItemId(null);
        queryClient.invalidateQueries({
          queryKey: ["sale", saleId, "returns", retId],
        });
        queryClient.invalidateQueries({
          queryKey: ["sale", saleId, "returns", retId, "balance"],
        });
        toast({
          title: "تم حذف الصنف",
          description: "تم حذف الصنف من قائمة المرتجع بنجاح.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "فشل حذف الصنف",
          description: "حدث خطأ أثناء حذف الصنف من المرتجع.",
          variant: "destructive",
        });
      },
    });
  };

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: SalesReturnItemDto, index: number) => index + 1,
    },
    {
      key: "medicineName",
      header: "اسم الصنف",
      render: (item: SalesReturnItemDto) => (
        <span className="font-medium">{item.medicineName || "غير محدد"}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item: SalesReturnItemDto) => (
        <span className="text-muted-foreground">
          {item.batchNumber || "غير محدد"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية المرتجعة",
      render: (item: SalesReturnItemDto) => (
        <span className="font-semibold">{item.quantity}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "سعر الوحدة",
      className: "font-mono",
      render: (item: SalesReturnItemDto) => formatCurrency(item.unitPrice),
    },
    {
      key: "totalPrice",
      header: "الإجمالي",
      className: "font-mono font-semibold text-primary",
      render: (item: SalesReturnItemDto) => formatCurrency(item.totalPrice),
    },
    ...(isDraft
      ? [
          {
            key: "actions",
            header: "",
            className: "w-20 text-left",
            render: (item: SalesReturnItemDto) => (
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => setEditingItem(item)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                  onClick={() => setDeletingItemId(item.salesReturnItemId)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card className="overflow-hidden dir-rtl">
      {/* Return Header */}
      <div className="p-6 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/finance/sales/${saleId}/returns`)}
          className="mb-4 -mr-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى المرتجعات
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-linear-to-tr from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 shadow-md border border-primary/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  تفاصيل المرتجع #{salesReturn.salesReturnId}
                </h1>
                <SalesReturnStatusBadge status={salesReturn.status ?? SalesReturnStatus.Draft} />
              </div>
              <p className="text-xs text-muted-foreground">
                المرتجع تابع للفاتورة الأصليّة #{saleId}
                {salesReturn.createdAt && ` | تاريخ المرتجع: ${formatDate(salesReturn.createdAt)}`}
                {salesReturn.userName && ` | بواسطة: ${salesReturn.userName}`}
              </p>
            </div>
          </div>

          {isDraft && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                disabled={isCancelling}
              >
                <XCircle className="w-4 h-4 ml-1" />
                إلغاء المرتجع
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setCompleteDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                disabled={isCompleting || salesReturn.items.length === 0}
              >
                <CheckCircle className="w-4 h-4 ml-1" />
                إكمال المرتجع
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Return note description if exists */}
        {salesReturn.note && (
          <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-sm">
            <span className="font-semibold block mb-1">ملاحظة/سبب الإرجاع:</span>
            <span className="text-muted-foreground">{salesReturn.note}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            icon={Coins}
            label="إجمالي المرتجع"
            value={
              <span className="flex items-center gap-1">
                {formatCurrency(balance?.totalAmount ?? salesReturn.totalAmount)}
                <Banknote className="w-4 h-4 text-muted-foreground" />
              </span>
            }
          />
          <StatCard
            icon={Wallet}
            label="المبلغ المردود للعميل"
            value={
              <span className="flex items-center gap-1">
                {formatCurrency(balance?.paidAmount ?? 0)}
                <Banknote className="w-4 h-4 text-muted-foreground" />
              </span>
            }
          />
          <StatCard
            icon={Banknote}
            label="المتبقي المردود"
            value={
              <span className="flex items-center gap-1">
                {formatCurrency(balance?.remainingAmount ?? (balance?.totalAmount ?? salesReturn.totalAmount))}
                <Banknote className="w-4 h-4 text-muted-foreground" />
              </span>
            }
          />
        </div>

        {/* Items Section Header */}
        <div>
          <div className="flex flex-row-reverse items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              إجمالي {salesReturn.items.length} أصناف مرتجعة
            </h3>
            <div className="flex items-center gap-2">
              {isDraft && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddDialogOpen(true)}
                  className="gap-1 cursor-pointer"
                  disabled={isAdding}
                >
                  <Plus className="w-4 h-4" />
                  إضافة صنف
                </Button>
              )}
              <h3 className="font-semibold text-base flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                الأصناف المرتجعة
              </h3>
            </div>
          </div>

          {/* Items Table */}
          <DataTable
            columns={columns}
            data={salesReturn.items}
            keyExtractor={(item) => item.salesReturnItemId}
            emptyMessage="لم يتم إضافة أي صنف مرتجع حتى الآن"
          />
        </div>
      </div>

      {/* Dialogs */}
      {addDialogOpen && (
        <AddReturnItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          sale={sale}
          existingSaleItemIds={salesReturn.items.map((i) => i.saleItemId)}
          onAdd={addReturnItem}
          isPending={isAdding}
        />
      )}

      {editingItem && (
        <EditReturnItemDialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          item={editingItem}
          sale={sale}
          onUpdate={updateReturnItem}
          isPending={isUpdating}
        />
      )}

      {/* Complete Return Confirm Dialog */}
      <ConfirmDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        title="تأكيد إكمال المرتجع"
        description="هل أنت متأكد من إكمال هذا المرتجع؟ سيتم ترحيل المرتجع وتعديل كميات المخزون نهائياً ولا يمكن التراجع أو التعديل بعد ذلك."
        confirmLabel="إكمال المرتجع"
        cancelLabel="إلغاء"
        onConfirm={handleCompleteReturn}
        isPending={isCompleting}
        variant="default"
      />

      {/* Cancel Return Confirm Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="تأكيد إلغاء المرتجع"
        description="هل أنت متأكد من إلغاء هذا المرتجع؟ سيتم حذف مسودة المرتجع ولن يتم إجراء أي تعديل على المخزون."
        confirmLabel="إلغاء المرتجع"
        cancelLabel="تراجع"
        onConfirm={handleCancelReturn}
        isPending={isCancelling}
        variant="destructive"
      />

      {/* Delete Item Confirm Dialog */}
      <ConfirmDialog
        open={deletingItemId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null);
        }}
        title="حذف صنف من المرتجع"
        description="هل أنت متأكد من حذف هذا الصنف من المرتجع؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        onConfirm={handleDeleteItem}
        isPending={isDeleting}
        variant="destructive"
      />
    </Card>
  );
}
