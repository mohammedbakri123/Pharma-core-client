import { useState, useCallback } from "react";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Spinner } from "@/ui/spinner";
import { CreditCard, Banknote, Plus, X, Check } from "lucide-react";

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  card: "بطاقة",
};

export default function CartSummary({
  subtotal,
  discount,
  onDiscountChange,
  total,
  payments,
  onPaymentsChange,
  change,
  note,
  onNoteChange,
  cart,
  onCheckout,
  isPending,
}: any) {
  const [showNote, setShowNote] = useState(false);

  const totalPaid = payments.reduce(
    (s: number, p: any) => s + Number(p.amount),
    0,
  );
  const remaining = Math.max(0, total - totalPaid);
  const isFullyPaid = totalPaid >= total;
  const hasCash = payments.some((p: any) => p.method === "cash");

  const addRow = useCallback(() => {
    const paid = payments.reduce((s: number, p: any) => s + Number(p.amount), 0);
    onPaymentsChange([...payments, { method: "cash", amount: Math.max(0, total - paid) }]);
  }, [payments, total, onPaymentsChange]);

  const removeRow = useCallback(
    (i: number) => onPaymentsChange(payments.filter((_: any, idx: number) => idx !== i)),
    [payments, onPaymentsChange],
  );

  const updateRow = useCallback(
    (i: number, field: string, value: any) => {
      const next = payments.map((p: any, idx: number) =>
        idx === i ? { ...p, [field]: value } : p,
      );

      if (field === "amount") {
        const others = next.reduce(
          (s: number, p: any, idx: number) => s + (idx !== i ? Number(p.amount) : 0),
          0,
        );
        const maxAllowed = Math.max(0, total - others);
        next[i] = { ...next[i], amount: Math.min(Number(value), maxAllowed + Number(value)) };
        const capped = Math.min(Number(value), maxAllowed);
        // For card, cap at remaining; for cash, allow overpayment
        if (next[i]!.method === "card") {
          next[i] = { ...next[i], amount: Math.min(capped, maxAllowed) };
        }
      }

      onPaymentsChange(next);
    },
    [payments, total, onPaymentsChange],
  );

  const toggleMethod = useCallback(
    (i: number) => {
      const current = payments[i]!;
      const newMethod = current.method === "cash" ? "card" : "cash";
      if (newMethod === "card") {
        const others = payments.reduce(
          (s: number, p: any, idx: number) => s + (idx !== i ? Number(p.amount) : 0),
          0,
        );
        const maxAllowed = Math.max(0, total - others);
        const next = [...payments];
        next[i] = { method: "card", amount: Math.min(Number(current.amount), maxAllowed) };
        onPaymentsChange(next);
      } else {
        updateRow(i, "method", "cash");
      }
    },
    [payments, total, onPaymentsChange, updateRow],
  );

  return (
    <div className="p-4 bg-muted/50 border-t border-border space-y-3">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground shrink-0">الخصم</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={subtotal}
              step={0.5}
              value={discount}
              onChange={(e) =>
                onDiscountChange(Math.max(0, Number(e.target.value)))
              }
              className="w-20 h-7 text-left text-sm bg-background rounded border border-border px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
            />
            <span className="text-xs text-muted-foreground">ر.س</span>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-bold text-lg text-foreground">
          <span>الإجمالي</span>
          <span>{total.toFixed(2)} ر.س</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">طرق الدفع</span>
          {!isFullyPaid && (
            <button
              onClick={addRow}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              إضافة طريقة دفع
            </button>
          )}
        </div>

        {payments.map((p: any, i: number) => {
          const others = payments.reduce(
            (s: number, pp: any, idx: number) =>
              s + (idx !== i ? Number(pp.amount) : 0),
            0,
          );
          const maxAllowed = Math.max(0, total - others);

          return (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2 bg-background rounded border border-border p-2">
                <button
                  onClick={() => toggleMethod(i)}
                  className={`flex items-center justify-center gap-1.5 text-xs h-8 rounded transition-colors ${
                    p.method === "cash"
                      ? "bg-primary/10 text-primary font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  {methodLabels.cash}
                </button>
                <button
                  onClick={() => toggleMethod(i)}
                  className={`flex items-center justify-center gap-1.5 text-xs h-8 rounded transition-colors ${
                    p.method === "card"
                      ? "bg-primary/10 text-primary font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  {methodLabels.card}
                </button>
                <div className="col-span-2 flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={p.amount}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      const capped =
                        p.method === "card"
                          ? Math.min(val, maxAllowed)
                          : val;
                      updateRow(i, "amount", capped);
                    }}
                    className="w-full h-7 text-left text-sm bg-background rounded border border-border px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">
                    ر.س
                  </span>
                </div>
              </div>
              {payments.length > 1 && (
                <button
                  onClick={() => removeRow(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`text-sm text-center flex items-center justify-center gap-1.5 ${
          isFullyPaid
            ? "text-green-600 dark:text-green-400"
            : "text-amber-600 dark:text-amber-400"
        }`}
      >
        {isFullyPaid ? (
          <>
            <Check className="w-4 h-4" />
            تمت التغطية
          </>
        ) : (
          <>المتبقي: {remaining.toFixed(2)} ر.س</>
        )}
      </div>

      {isFullyPaid && hasCash && change > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-green-600 dark:text-green-400">الباقي للعميل</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {change.toFixed(2)} ر.س
          </span>
        </div>
      )}

      <button
        onClick={() => setShowNote(!showNote)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showNote ? "- إخفاء الملاحظات" : "+ إضافة ملاحظة"}
      </button>

      {showNote && (
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="ملاحظة للفاتورة..."
          className="w-full h-16 resize-none text-sm bg-background rounded border border-border p-2"
        />
      )}

      <Button
        className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20"
        size="lg"
        disabled={cart.length === 0 || !isFullyPaid || isPending}
        onClick={onCheckout}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="w-5 h-5" />
            جاري المعالجة...
          </span>
        ) : (
          "إتمام الدفع"
        )}
      </Button>
    </div>
  );
}
