import { useState } from "react";
import { Button } from "@/ui/button";
import { Column, DataTable } from "@/ui/data-table";
import { Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  useAddPurchaseItem,
  useDeletePurchaseItem,
  useUpdatePurchaseItem,
} from "../../hooks/usePurchases";
import type { PurchaseDetailsDto, PurchaseItemDetailsDto } from "@/types";
import { PurchaseStatus } from "@/types";
import AddPurchaseItemDialog from "./AddPurchaseItemDialog";
import EditPurchaseItemDialog from "./EditPurchaseItemDialog";
import DeletePurchaseItemConfirmDialog from "./DeletePurchaseItemConfirmDialog";

interface PurchaseItemsTableProps {
  purchase: PurchaseDetailsDto;
}

export default function PurchaseItemsTable({
  purchase,
}: PurchaseItemsTableProps) {
  const isDraft = purchase.status === PurchaseStatus.Draft;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<PurchaseItemDetailsDto | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const { mutate: addMutation, isPending: isAdding } = useAddPurchaseItem(
    purchase.purchaseId,
  );
  const { mutate: updateMutation, isPending: isUpdating } =
    useUpdatePurchaseItem(purchase.purchaseId);
  const { mutate: deleteMutation, isPending: isDeleting } =
    useDeletePurchaseItem(purchase.purchaseId);

  const columns: Column<PurchaseItemDetailsDto>[] = [
    {
      key: "index",
      header: "#",
      className: "text-muted-foreground w-12",
      render: (_item, index) => index + 1,
    },
    {
      key: "medicineId",
      header: "معرف الصنف",
      render: (item) => <span className="font-medium">#{item.medicineId}</span>,
    },
    {
      key: "medicineName",
      header: "اسم الصنف",
      render: (item) => (
        <span className="font-medium">{item.medicineName || "غير محدد"}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.batchNumber || "غير محدد"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية",
      render: (item) => <span className="font-semibold">{item.quantity}</span>,
    },
    {
      key: "purchasePrice",
      header: "سعر الشراء",
      className: "font-mono",
      render: (item) => formatCurrency(item.purchasePrice),
    },
    {
      key: "sellPrice",
      header: "سعر البيع",
      className: "font-mono",
      render: (item) => formatCurrency(item.sellPrice),
    },
    {
      key: "totalPrice",
      header: "الإجمالي",
      className: "font-mono font-semibold text-primary",
      render: (item) => formatCurrency(item.totalPrice),
    },
    {
      key: "expireDate",
      header: "تاريخ الانتهاء",
      render: (item) => formatDate(item.expireDate),
    },
    ...(isDraft
      ? [
          {
            key: "actions",
            header: "",
            className: "w-20 text-left",
            render: (item: PurchaseItemDetailsDto) => (
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
                  onClick={() => setDeletingItemId(item.purchaseItemId)}
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
          إجمالي {purchase.items.length} صنف
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
        data={purchase.items}
        keyExtractor={(item) => item.purchaseItemId}
        emptyMessage="لا توجد أصناف في هذه الفاتورة"
      />

      {addDialogOpen && (
        <AddPurchaseItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAdd={(data, options) => addMutation(data, options)}
          isPending={isAdding}
        />
      )}

      {editingItem && (
        <EditPurchaseItemDialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          item={editingItem}
          onUpdate={(args, options) => updateMutation(args, options)}
          isPending={isUpdating}
        />
      )}

      <DeletePurchaseItemConfirmDialog
        open={!!deletingItemId}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null);
        }}
        itemId={deletingItemId}
        onDelete={(id, options) => deleteMutation(id, options)}
        isPending={isDeleting}
      />
    </div>
  );
}
