import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { formatCurrency } from "@/utils/formatters";
import type {
  SaleDetailsDto,
  SalesReturnItemDto,
  UpdateSalesReturnItemRequest,
} from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EditReturnItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SalesReturnItemDto | null;
  sale: SaleDetailsDto;
  onUpdate: (
    args: { itemId: number; data: UpdateSalesReturnItemRequest },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => void;
  isPending: boolean;
}

export default function EditReturnItemDialog({
  open,
  onOpenChange,
  item,
  sale,
  onUpdate,
  isPending,
}: EditReturnItemDialogProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<string>("1");

  // Find the original sold item to get the maximum allowed quantity
  const originalSaleItem = item
    ? sale.items.find((si) => si.saleItemId === item.saleItemId)
    : null;

  useEffect(() => {
    if (open && item) {
      setQuantity(item.quantity.toString());
    }
  }, [open, item]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !originalSaleItem) return;

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      toast({
        title: "الكمية غير صالحة",
        description: "يرجى إدخال كمية صحيحة أكبر من الصفر.",
        variant: "destructive",
      });
      return;
    }

    if (qtyNumber > originalSaleItem.quantity) {
      toast({
        title: "تجاوز الكمية المباعة",
        description: `لا يمكن إرجاع كمية أكبر من الكمية المباعة (${originalSaleItem.quantity}).`,
        variant: "destructive",
      });
      return;
    }

    onUpdate(
      {
        itemId: item.salesReturnItemId,
        data: { quantity: qtyNumber },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "تم تعديل الكمية المرتجعة",
            description: "تم تعديل الكمية بنجاح في المرتجع.",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "فشل تعديل الكمية",
            description: "حدث خطأ أثناء تعديل كمية الصنف المرتجع.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!item || !originalSaleItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dir-rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تعديل كمية الصنف المرتجع</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 text-right">
          <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-sm space-y-2">
            <div className="flex justify-between flex-row-reverse">
              <span className="text-muted-foreground">اسم الصنف:</span>
              <span className="font-semibold">{item.medicineName}</span>
            </div>
            <div className="flex justify-between flex-row-reverse">
              <span className="text-muted-foreground">الكمية المباعة أصلاً:</span>
              <span className="font-semibold">{originalSaleItem.quantity}</span>
            </div>
            <div className="flex justify-between flex-row-reverse">
              <span className="text-muted-foreground">سعر البيع للوحدة:</span>
              <span className="font-mono font-semibold">
                {formatCurrency(item.unitPrice)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editReturnedQty">الكمية المرتجعة الجديدة</Label>
            <Input
              id="editReturnedQty"
              type="number"
              min="1"
              max={originalSaleItem.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="أدخل الكمية"
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "جاري الحفظ..." : "حفظ التعديل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
