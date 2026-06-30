import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle } from "lucide-react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";

import { ConfirmDialog } from "@/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
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

import AddReturnItemDialog from "../components/Sales/SaleDetail/returns/SalesReturnDetail/AddReturnItemDialog";
import EditReturnItemDialog from "../components/Sales/SaleDetail/returns/SalesReturnDetail/EditReturnItemDialog";
import SalesReturnHeader from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnHeader";
import SalesReturnNote from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnNote";
import SalesReturnSummaryCards from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnSummaryCards";
import SalesReturnItemSectionHeader from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnItemSectionHeader";
import SalesReturnTable from "../components/Sales/SaleDetail/returns/SalesReturnDetail/SalesReturnTable";

//TODO: this file need a shit refactoring
export default function SaleReturnDetailPage() {
  const { id, returnId } = useParams<{ id: string; returnId: string }>();
  const saleId = Number(id);
  const retId = Number(returnId);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesReturnItemDto | null>(
    null,
  );
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
    retId,
  );

  // Mutations
  const { mutate: addReturnItem, isPending: isAdding } = useAddSaleReturnItem(
    saleId,
    retId,
  );
  const { mutate: updateReturnItem, isPending: isUpdating } =
    useUpdateSaleReturnItem(saleId, retId);
  const { mutate: deleteReturnItem, isPending: isDeleting } =
    useDeleteSaleReturnItem(saleId, retId);
  const { mutate: completeReturn, isPending: isCompleting } =
    useCompleteSaleReturn(saleId);
  const { mutate: cancelReturn, isPending: isCancelling } =
    useCancelSaleReturn(saleId);

  const isLoading = returnLoading || saleLoading || balanceLoading;
  const isError = returnError || !salesReturn || !sale;

  if (isLoading) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">
            جاري تحميل تفاصيل المرتجع...
          </p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="dir-rtl">
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-destructive font-medium">
            فشل تحميل بيانات المرتجع
          </p>
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

  return (
    <Card className="overflow-hidden dir-rtl">
      {/* Return Header */}
      <SalesReturnHeader
        saleId={saleId}
        salesReturn={salesReturn}
        isDraft={isDraft}
        isCompleting={isCompleting}
        isCancelling={isCancelling}
        setCompleteDialogOpen={setCompleteDialogOpen}
        setCancelDialogOpen={setCancelDialogOpen}
        onBack={() => navigate(`/finance/sales/${saleId}/returns`)}
      />

      <div className="p-6 space-y-6">
        {/* Return note description if exists */}
        {salesReturn.note && <SalesReturnNote note={salesReturn.note} />}
        {/* Summary Cards */}
        <SalesReturnSummaryCards balance={balance} salesReturn={salesReturn} />
        {/* Items Section Header */}
        <SalesReturnItemSectionHeader
          isAdding={isAdding}
          isDraft={isDraft}
          itemLength={salesReturn.items.length}
          setAddDialogOpen={setAddDialogOpen}
        />
      </div>
      <SalesReturnTable
        isDraft={isDraft}
        items={salesReturn.items}
        setDeletingItemId={setDeletingItemId}
        setEditingItem={setEditingItem}
      />

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
