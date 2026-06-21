import { useState } from "react";
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
import { Plus, Trash2, Banknote } from "lucide-react";
import { PaymentMethod } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { useCompleteSale } from "../../hooks/useSales";
import type { SalePaymentRequest } from "@/types";

interface CompleteSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: number;
  totalAmount: number;
  onSuccess?: () => void;
}

interface PaymentEntry {
  id: string;
  amount: string;
  method: string;
}

export default function CompleteSaleDialog({
  open,
  onOpenChange,
  saleId,
  totalAmount,
  onSuccess,
}: CompleteSaleDialogProps) {
  const [payments, setPayments] = useState<PaymentEntry[]>([
    { id: "1", amount: String(totalAmount), method: String(PaymentMethod.Cash) },
  ]);
  const completeMutation = useCompleteSale(saleId);

  const totalPayments = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );
  const balance = totalAmount - totalPayments;
  const isValid = totalPayments >= totalAmount;

  const addPayment = () => {
    const id = String(Date.now());
    const remaining = Math.max(0, totalAmount - totalPayments);
    setPayments([
      ...payments,
      { id, amount: remaining > 0 ? String(remaining) : "0", method: String(PaymentMethod.Cash) },
    ]);
  };

  const removePayment = (id: string) => {
    if (payments.length === 1) return;
    setPayments(payments.filter((p) => p.id !== id));
  };

  const updatePayment = (id: string, field: keyof PaymentEntry, value: string) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSubmit = () => {
    const salePayments: SalePaymentRequest[] = payments.map((p) => ({
      amount: Number(p.amount),
      method: Number(p.method) as PaymentMethod,
    }));

    completeMutation.mutate(
      { payments: salePayments },
      {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            إتمام الفاتورة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">إجمالي الفاتورة</span>
            <span className="text-lg font-bold">{formatCurrency(totalAmount)} ريال</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>طرق الدفع</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPayment}
                className="gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة وسيلة دفع
              </Button>
            </div>

            {payments.map((payment, index) => (
              <div
                key={payment.id}
                className="flex items-end gap-2 p-3 rounded-lg border border-border/40 bg-card"
              >
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">المبلغ</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={payment.amount}
                    onChange={(e) =>
                      updatePayment(payment.id, "amount", e.target.value)
                    }
                    placeholder="المبلغ"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">طريقة الدفع</Label>
                  <Select
                    value={payment.method}
                    onValueChange={(v) =>
                      updatePayment(payment.id, "method", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-destructive cursor-pointer"
                  onClick={() => removePayment(payment.id)}
                  disabled={payments.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
            <span className="text-sm text-muted-foreground">المجموع</span>
            <span
              className={`text-lg font-bold ${
                balance === 0
                  ? "text-green-600"
                  : balance > 0
                    ? "text-amber-600"
                    : "text-destructive"
              }`}
            >
              {formatCurrency(totalPayments)} ريال
            </span>
          </div>

          {balance > 0 && (
            <p className="text-xs text-amber-600">
              المتبقي: {formatCurrency(balance)} ريال — يجب تسديد كامل المبلغ
            </p>
          )}
          {balance < 0 && (
            <p className="text-xs text-green-600">
              الباقي للعميل: {formatCurrency(Math.abs(balance))} ريال
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={completeMutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || completeMutation.isPending}
          >
            {completeMutation.isPending
              ? "جاري الإتمام..."
              : "إتمام الفاتورة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
