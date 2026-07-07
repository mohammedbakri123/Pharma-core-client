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
import type { SaleItemDto, UpdateSaleItemRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SaleItemDto;
  onUpdate: (
    args: { itemId: number; data: UpdateSaleItemRequest },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function EditItemDialog({
  open,
  onOpenChange,
  item,
  onUpdate,
  isPending,
}: EditItemDialogProps) {
  const [quantity, setQuantity] = useState(String(item.quantity));
  const { toast } = useToast();

  useEffect(() => {
    setQuantity(String(item.quantity));
  }, [item.quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(
      { itemId: item.saleItemId, data: { quantity: Number(quantity) } },
      {
        onSuccess: () => {
          onOpenChange(false);
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل الصنف #{item.medicineId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">الكمية</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="text-sm text-muted-foreground">
            سعر الوحدة: {item.unitPrice.toLocaleString()} ريال
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
