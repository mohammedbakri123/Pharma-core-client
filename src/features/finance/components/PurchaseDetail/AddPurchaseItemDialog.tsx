import { useState } from "react";
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
import type { AddPurchaseItemRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddPurchaseItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    data: AddPurchaseItemRequest,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  isPending: boolean;
}

export default function AddPurchaseItemDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddPurchaseItemDialogProps) {
  const { toast } = useToast();
  const [medicineId, setMedicineId] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [expireDate, setExpireDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(
      {
        medicineId: Number(medicineId),
        batchNumber,
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        sellPrice: Number(sellPrice),
        expireDate: expireDate || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
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
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة صنف للفاتورة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="medicineId">معرف الصنف</Label>
              <Input
                id="medicineId"
                type="number"
                min="1"
                value={medicineId}
                onChange={(e) => setMedicineId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNumber">رقم الباتش</Label>
              <Input
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                required
              />
            </div>
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
              {isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
