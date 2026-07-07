import {
  PurchaseReturnDetailsDto,
  PurchaseReturnItemDto,
  PurchaseReturnStatus,
} from "@/types";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { formatCurrency } from "@/utils/formatters";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import EditPurchaseReturnItemDialog from "./EditPurchaseReturnItemDialog";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import {
  useDeletePurchaseReturnItem,
  useUpdatePurchaseReturnItem,
} from "@features/finance/common/hooks/usePurchaseReturns";
import { useToast } from "@/hooks/use-toast";
import PurchaseReturnTableHeader from "./PurchaseReturnTableHeader";

interface Props {
  purchaseReturn: PurchaseReturnDetailsDto;
}

export default function PurchaseReturnTable({ purchaseReturn }: Props) {
  const { toast } = useToast();

  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<PurchaseReturnItemDto | null>(
    null,
  );
  const isDraft = purchaseReturn.status === PurchaseReturnStatus.Draft;

  const { mutate: updateReturnItem, isPending: isUpdating } =
    useUpdatePurchaseReturnItem(purchaseReturn.purchaseId!, purchaseReturn.purchaseReturnId);
  const { mutate: deleteReturnItem, isPending: isDeleting } =
    useDeletePurchaseReturnItem(purchaseReturn.purchaseId!, purchaseReturn.purchaseReturnId);

  const handleDeleteItem = () => {
    if (deletingItemId === null) return;
    deleteReturnItem(deletingItemId, {
      onSuccess: () => {
        setDeletingItemId(null);
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
      render: (_: PurchaseReturnItemDto, index: number) => index + 1,
    },
    {
      key: "medicineName",
      header: "اسم الصنف",
      render: (item: PurchaseReturnItemDto) => (
        <span className="font-medium">{(item as any).medicineName || "غير محدد"}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item: PurchaseReturnItemDto) => (
        <span className="text-muted-foreground">
          {(item as any).batchNumber || "غير محدد"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية المرتجعة",
      render: (item: PurchaseReturnItemDto) => (
        <span className="font-semibold">{item.quantity}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "سعر الوحدة",
      className: "font-mono",
      render: (item: PurchaseReturnItemDto) => formatCurrency(item.unitPrice),
    },
    {
      key: "totalPrice",
      header: "الإجمالي",
      className: "font-mono font-semibold text-primary",
      render: (item: PurchaseReturnItemDto) => formatCurrency(item.totalPrice),
    },
    ...(isDraft
      ? [
          {
            key: "actions",
            header: "",
            className: "w-20 text-left",
            render: (item: PurchaseReturnItemDto) => (
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
                  onClick={() => setDeletingItemId(item.purchaseReturnItemId)}
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
    <>
      <div>
        <PurchaseReturnTableHeader purchaseReturn={purchaseReturn} />
        <DataTable
          columns={columns}
          data={purchaseReturn.items}
          keyExtractor={(item) => item.purchaseReturnItemId}
          emptyMessage="لم يتم إضافة أي صنف مرتجع حتى الآن"
        />
      </div>
      {editingItem && (
        <EditPurchaseReturnItemDialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          item={editingItem}
          purchaseId={purchaseReturn.purchaseId!}
          onUpdate={updateReturnItem}
          isPending={isUpdating}
        />
      )}
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
    </>
  );
}
