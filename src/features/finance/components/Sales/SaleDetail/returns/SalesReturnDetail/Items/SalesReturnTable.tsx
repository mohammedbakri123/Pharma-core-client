import {
  SalesReturnDetailsDto,
  SalesReturnItemDto,
  SalesReturnStatus,
} from "@/types";
import { Button } from "@/ui/button";
import { DataTable } from "@/ui/data-table";
import { formatCurrency } from "@/utils/formatters";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import EditReturnItemDialog from "./EditReturnItemDialog";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import {
  useDeleteSaleReturnItem,
  useUpdateSaleReturnItem,
} from "@features/finance/hooks/useSalesReturns";
import { useToast } from "@/hooks/use-toast";

interface props {
  SaleReturn: SalesReturnDetailsDto;
}

export default function SalesReturnTable({ SaleReturn }: props) {
  const { toast } = useToast();

  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<SalesReturnItemDto | null>(
    null,
  );
  const isDraft = SaleReturn.status === SalesReturnStatus.Draft;

  const { mutate: updateReturnItem, isPending: isUpdating } =
    useUpdateSaleReturnItem(SaleReturn.saleId, SaleReturn.salesReturnId);
  const { mutate: deleteReturnItem, isPending: isDeleting } =
    useDeleteSaleReturnItem(SaleReturn.saleId, SaleReturn.salesReturnId);

  // Delete item handler
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
    <>
      <div>
        {/* Items Table */}
        <DataTable
          columns={columns}
          data={SaleReturn.items}
          keyExtractor={(item) => item.salesReturnItemId}
          emptyMessage="لم يتم إضافة أي صنف مرتجع حتى الآن"
        />
      </div>
      {editingItem && (
        <EditReturnItemDialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          item={editingItem}
          saleId={SaleReturn.saleId}
          onUpdate={updateReturnItem}
          isPending={isUpdating}
        />
      )}
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
    </>
  );
}
