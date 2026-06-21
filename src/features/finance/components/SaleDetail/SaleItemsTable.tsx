import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/button";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useAddSaleItem, useUpdateSaleItem, useDeleteSaleItem } from "../../hooks/useSales";
import type { SaleItemDto, SaleDetailsDto } from "@/types";
import { SaleStatus } from "@/types";
import AddItemDialog from "./AddItemDialog";
import EditItemDialog from "./EditItemDialog";

interface SaleItemsTableProps {
  sale: SaleDetailsDto;
}

export default function SaleItemsTable({ sale }: SaleItemsTableProps) {
  const isDraft = sale.status === SaleStatus.Draft;
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaleItemDto | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const addMutation = useAddSaleItem(sale.saleId);
  const updateMutation = useUpdateSaleItem(sale.saleId);
  const deleteMutation = useDeleteSaleItem(sale.saleId);

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
      key: "batchId",
      header: "الباتش",
      render: (item: SaleItemDto) => (
        <span className="text-muted-foreground">#{item.batchId}</span>
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
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
            addMutation.mutate(data, {
              onSuccess: () => setAddDialogOpen(false),
            })
          }
          isPending={addMutation.isPending}
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
            updateMutation.mutate(
              { itemId: editingItem.saleItemId, data },
              { onSuccess: () => setEditingItem(null) },
            )
          }
          isPending={updateMutation.isPending}
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
            deleteMutation.mutate(deletingItemId, {
              onSuccess: () => setDeletingItemId(null),
            });
          }
        }}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
