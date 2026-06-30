import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { PaymentMethod } from "@/types";
import type { CreatePurchasePaymentRequest } from "@/types";

interface AddPurchasePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: CreatePurchasePaymentRequest) => void;
  isPending: boolean;
}

export default function AddPurchasePaymentDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddPurchasePaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(String(PaymentMethod.Cash));
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      method: Number(method),
      amount: Number(amount),
      description: description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة دفعة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">طريقة الدفع</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full">
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
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ملاحظة للدفعة"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
