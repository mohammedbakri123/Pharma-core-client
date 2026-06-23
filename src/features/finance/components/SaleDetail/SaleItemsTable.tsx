import { useState } from "react";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/button";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import {
  useAddSaleItem,
  useUpdateSaleItem,
  useDeleteSaleItem,
} from "../../hooks/useSales";
import type { SaleItemDto, SaleDetailsDto } from "@/types";
import { SaleStatus } from "@/types";
import AddItemDialog from "./AddItemDialog";
import EditItemDialog from "./EditItemDialog";
import { useToast } from "@/hooks/use-toast";

interface SaleItemsTableProps {
  sale: SaleDetailsDto;
}

export default function SaleItemsTable({ sale }: SaleItemsTableProps) {
  const isDraft = sale.status === SaleStatus.Draft;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaleItemDto | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const { toast } = useToast();

  const { mutate: addMutation, isPending: isAdding } = useAddSaleItem(
    sale.saleId,
  );
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateSaleItem(
    sale.saleId,
  );
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteSaleItem(
    sale.saleId,
  );

  const columns = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_: SaleItemDto, index: number) => index + 1,
    },
    {
      key: "medicineId",
      header: "معرف الصنف",
      render: (item: SaleItemDto) => (
        <span className="font-medium">#{item.medicineId}</span>
      ),
    },
    {
      key: "medicineName",
      header: "اسم الصنف",
      render: (item: SaleItemDto) => (
        <span className="font-medium">{item.medicineName || "غير محدد"}</span>
      ),
    },
    {
      key: "batchId",
      header: "الباتش",
      render: (item: SaleItemDto) => (
        <span className="text-muted-foreground">#{item.batchId}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item: SaleItemDto) => (
        <span className="text-muted-foreground">
          {item.batchNumber || "غير محدد"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية",
      render: (item: SaleItemDto) => (
        <span className="font-semibold">{item.quantity}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "سعر الوحدة",
      className: "font-mono",
      render: (item: SaleItemDto) => formatCurrency(item.unitPrice),
    },
    {
      key: "totalPrice",
      header: "الإجمالي",
      className: "font-mono font-semibold text-primary",
      render: (item: SaleItemDto) => formatCurrency(item.totalPrice),
    },
    ...(isDraft
      ? [
          {
            key: "actions",
            header: "",
            className: "w-20 text-left",
            render: (item: SaleItemDto) => (
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
                  onClick={() => setDeletingItemId(item.saleItemId)}
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {sale.items.length} صنف
        </h3>
        <div className="flex items-center gap-2">
          {isDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة صنف
            </Button>
          )}
          <h3 className="font-semibold text-base flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            أصناف الفاتورة
          </h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sale.items}
        keyExtractor={(item) => item.saleItemId}
        emptyMessage="لا توجد أصناف في هذه الفاتورة"
      />

      {addDialogOpen && (
        <AddItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAdd={(data) =>
            addMutation(data, {
              onSuccess: () => {
                setAddDialogOpen(false);
                toast({
                  title: "تمت إضافة الصنف بنجاح",
                  description: "تمت إضافة الصنف إلى الفاتورة بنجاح.",
                  variant: "success",
                });
              },
              onError: () => {
                toast({
                  title: "فشل إضافة الصنف",
                  description: "حدث خطأ أثناء إضافة الصنف إلى الفاتورة.",
                  variant: "destructive",
                });
              },
            })
          }
          isPending={isAdding}
        />
      )}

      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          item={editingItem}
          onUpdate={(data) =>
            updateMutation(
              { itemId: editingItem.saleItemId, data },
              {
                onSuccess: () => {
                  setEditingItem(null);
                  toast({
                    title: "تم تحديث الصنف بنجاح",
                    description: "تم تحديث بيانات الصنف في الفاتورة بنجاح.",
                    variant: "success",
                  });
                },
                onError: () => {
                  toast({
                    title: "فشل تحديث الصنف",
                    description: "حدث خطأ أثناء تحديث بيانات الصنف.",
                    variant: "destructive",
                  });
                },
              },
            )
          }
          isPending={isUpdating}
        />
      )}

      <ConfirmDialog
        open={!!deletingItemId}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null);
        }}
        title="حذف الصنف"
        description="هل أنت متأكد من حذف هذا الصنف من الفاتورة؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="destructive"
        onConfirm={() => {
          if (deletingItemId) {
            deleteMutation(deletingItemId, {
              onSuccess: () => {
                setDeletingItemId(null);
                toast({
                  title: "تم حذف الصنف بنجاح",
                  description: "تم حذف الصنف من الفاتورة بنجاح.",
                  variant: "success",
                });
              },
              onError: () => {
                toast({
                  title: "فشل حذف الصنف",
                  description: "حدث خطأ أثناء حذف الصنف من الفاتورة.",
                  variant: "destructive",
                });
              },
            });
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
