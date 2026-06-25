import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import type {
  PurchaseItemDetailsDto,
  UpdatePurchaseItemRequest,
} from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EditPurchaseItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PurchaseItemDetailsDto;
  onUpdate: (
    args: { itemId: number; data: UpdatePurchaseItemRequest },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function EditPurchaseItemDialog({
  open,
  onOpenChange,
  item,
  onUpdate,
  isPending,
}: EditPurchaseItemDialogProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice));
  const [sellPrice, setSellPrice] = useState(String(item.sellPrice));
  const [expireDate, setExpireDate] = useState(item.expireDate ?? "");

  useEffect(() => {
    setQuantity(String(item.quantity));
    setPurchasePrice(String(item.purchasePrice));
    setSellPrice(String(item.sellPrice));
    setExpireDate(item.expireDate ?? "");
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(
      {
        itemId: item.purchaseItemId,
        data: {
          quantity: Number(quantity),
          purchasePrice: Number(purchasePrice),
          sellPrice: Number(sellPrice),
          expireDate: expireDate || undefined,
        },
      },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">سعر الشراء</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">سعر البيع</Label>
              <Input
                id="sellPrice"
                type="number"
                min="0"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expireDate">تاريخ الانتهاء</Label>
              <Input
                id="expireDate"
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
              />
            </div>
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
