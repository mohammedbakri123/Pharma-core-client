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

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SaleItemDto;
  onUpdate: (data: UpdateSaleItemRequest) => void;
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

  useEffect(() => {
    setQuantity(String(item.quantity));
  }, [item.quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ quantity: Number(quantity) });
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
