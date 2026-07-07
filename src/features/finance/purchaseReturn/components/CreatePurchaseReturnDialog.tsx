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
import { PaymentMethod } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useCreatePurchaseReturn } from "../../common/hooks/usePurchaseReturns";

interface CreatePurchaseReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: number;
}

export default function CreatePurchaseReturnDialog({
  open,
  onOpenChange,
  purchaseId,
}: CreatePurchaseReturnDialogProps) {
  const [note, setNote] = useState("");
  const [purchaseItemId, setPurchaseItemId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [refundMethod, setRefundMethod] = useState<string>(
    String(PaymentMethod.Cash),
  );
  const [refundDescription, setRefundDescription] = useState("");

  const mutation = useCreatePurchaseReturn(purchaseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        purchaseId,
        note: note || undefined,
        items: [
          {
            purchaseItemId: Number(purchaseItemId),
            batchId: Number(batchId),
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
          },
        ],
        refundPayment: {
          method: Number(refundMethod),
          description: refundDescription || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setNote("");
          setPurchaseItemId("");
          setBatchId("");
          setQuantity("1");
          setUnitPrice("");
          setRefundDescription("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>إنشاء مرتجع للفاتورة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="purchaseItemId">معرف صنف الفاتورة</Label>
              <Input
                id="purchaseItemId"
                type="number"
                min="1"
                value={purchaseItemId}
                onChange={(e) => setPurchaseItemId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchId">معرف الباتش</Label>
              <Input
                id="batchId"
                type="number"
                min="1"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnQuantity">الكمية</Label>
              <Input
                id="returnQuantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">سعر الوحدة</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">ملاحظات (اختياري)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="سبب المرتجع"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="refundMethod">طريقة الاسترداد</Label>
              <Select value={refundMethod} onValueChange={setRefundMethod}>
                <SelectTrigger id="refundMethod" className="w-full">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(PaymentMethod.Cash)}>
                    نقداً
                  </SelectItem>
                  <SelectItem value={String(PaymentMethod.Card)}>
                    بطاقة
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundDescription">وصف الاسترداد</Label>
              <Input
                id="refundDescription"
                value={refundDescription}
                onChange={(e) => setRefundDescription(e.target.value)}
                placeholder="وصف اختياري"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "جاري الإنشاء..." : "إنشاء المرتجع"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
