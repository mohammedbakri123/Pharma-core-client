import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { PaymentMethod, PaymentType, PaymentReferenceType } from "@/types";
import type { CreatePaymentRequest } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: CreatePaymentRequest) => void;
  isPending: boolean;
  saleId: number;
  remainingAmount?: number;
}

export default function AddPaymentDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
  saleId,
  remainingAmount,
}: AddPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(String(PaymentMethod.Cash));
  const [description, setDescription] = useState("");
  const [amountError, setAmountError] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setAmount("");
      setMethod(String(PaymentMethod.Cash));
      setDescription("");
      setAmountError("");
      setTimeout(() => amountRef.current?.focus(), 50);
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountError("");
    if (remainingAmount !== undefined && value !== "") {
      const numValue = Number(value);
      if (numValue > remainingAmount) {
        setAmountError(
          `المبلغ يتجاوز المتبقي (${formatCurrency(remainingAmount)})`,
        );
      } else if (numValue <= 0) {
        setAmountError("المبلغ يجب أن يكون أكبر من صفر");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (remainingAmount !== undefined && numAmount > remainingAmount) {
      setAmountError(
        `المبلغ يتجاوز المتبقي (${formatCurrency(remainingAmount)})`,
      );
      return;
    }
    onAdd({
      referenceType: PaymentReferenceType.Sale,
      referenceId: saleId,
      method: method as PaymentMethod,
      amount: numAmount,
      description: description || undefined,
    });
  };

  const isSubmitDisabled =
    isPending || !amount || Number(amount) <= 0 || amountError !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة دفعة جديدة</DialogTitle>
        </DialogHeader>

        {remainingAmount !== undefined && remainingAmount > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <span className="text-muted-foreground">المتبقي من الفاتورة: </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              ref={amountRef}
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="أدخل المبلغ"
              className={amountError ? "border-destructive" : ""}
              required
            />
            {amountError && (
              <p className="text-sm text-destructive">{amountError}</p>
            )}
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
            <Button type="submit" disabled={isSubmitDisabled}>
              {isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
