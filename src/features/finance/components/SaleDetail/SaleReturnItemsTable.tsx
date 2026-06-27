import { useState } from "react";
import { DataTable } from "@/ui/data-table";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { ConfirmDialog } from "@/ui/confirm-dialog";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type {
  SalesReturnItemDto,
  AddSalesReturnItemRequest,
  UpdateSalesReturnItemRequest,
} from "@/types";

interface SaleReturnItemsTableProps {
  items: SalesReturnItemDto[];
  onAddItem: (data: AddSalesReturnItemRequest) => void;
  onUpdateItem: (args: { itemId: number; data: UpdateSalesReturnItemRequest }) => void;
  onDeleteItem: (itemId: number) => void;
  isAddingItem: boolean;
  isUpdatingItem: boolean;
  isDeletingItem: boolean;
}

export default function SaleReturnItemsTable({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isAddingItem,
  isUpdatingItem,
  isDeletingItem,
}: SaleReturnItemsTableProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesReturnItemDto | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const [newSaleItemId, setNewSaleItemId] = useState("");
  const [newBatchId, setNewBatchId] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  const resetAddForm = () => {
    setNewSaleItemId("");
    setNewBatchId("");
    setNewQuantity("");
    setNewUnitPrice("");
  };

  const handleAddItem = () => {
    onAddItem({
      saleItemId: Number(newSaleItemId),
      batchId: Number(newBatchId),
      quantity: Number(newQuantity),
      unitPrice: Number(newUnitPrice),
    });
    setAddDialogOpen(false);
    resetAddForm();
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    onUpdateItem({
      itemId: editingItem.salesReturnItemId,
      data: { quantity: Number(editQuantity) },
    });
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    if (!deletingItemId) return;
    onDeleteItem(deletingItemId);
    setDeletingItemId(null);
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
        <span className="font-medium">{item.medicineName || `#${item.saleItemId}`}</span>
      ),
    },
    {
      key: "batchNumber",
      header: "رقم الباتش",
      render: (item: SalesReturnItemDto) => (
        <span className="text-muted-foreground">
          {item.batchNumber || `#${item.batchId}`}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "الكمية",
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
    {
      key: "actions",
      header: "",
      className: "w-20 text-left",
      render: (item: SalesReturnItemDto) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => {
              setEditingItem(item);
              setEditQuantity(String(item.quantity));
            }}
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
  ];

  return (
    <div>
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          إجمالي {items.length} صنف
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة صنف
          </Button>
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            أصناف المرتجع
          </h3>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.salesReturnItemId}
        emptyMessage="لا توجد أصناف في هذا المرتجع"
      />

      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) resetAddForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة صنف للمرتجع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="saleItemId">معرف صنف الفاتورة</Label>
              <Input id="saleItemId" type="number" min="1" value={newSaleItemId}
                onChange={(e) => setNewSaleItemId(e.target.value)}
                placeholder="أدخل معرف الصنف الأصلي" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchId">رقم الباتش</Label>
              <Input id="batchId" type="number" min="1" value={newBatchId}
                onChange={(e) => setNewBatchId(e.target.value)}
                placeholder="أدخل رقم الباتش" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input id="quantity" type="number" min="1" value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="أدخل الكمية المرتجعة" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">سعر الوحدة</Label>
              <Input id="unitPrice" type="number" min="0" step="0.01" value={newUnitPrice}
                onChange={(e) => setNewUnitPrice(e.target.value)}
                placeholder="أدخل سعر الوحدة" required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={isAddingItem}>
              إلغاء
            </Button>
            <Button onClick={handleAddItem}
              disabled={isAddingItem || !newSaleItemId || !newBatchId || !newQuantity || !newUnitPrice}>
              {isAddingItem ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => { if (!open) setEditingItem(null); }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل كمية الصنف</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editQuantity">الكمية</Label>
              <Input id="editQuantity" type="number" min="1" value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)} required />
            </div>
            {editingItem && (
              <div className="text-sm text-muted-foreground">
                سعر الوحدة: {formatCurrency(editingItem.unitPrice)} ريال
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isUpdatingItem}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateItem} disabled={isUpdatingItem || !editQuantity}>
              {isUpdatingItem ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingItemId}
        onOpenChange={(open) => { if (!open) setDeletingItemId(null); }}
        title="حذف الصنف"
        description="هل أنت متأكد من حذف هذا الصنف من المرتجع؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="destructive"
        onConfirm={handleDeleteItem}
        isPending={isDeletingItem}
      />
    </div>
  );
}
