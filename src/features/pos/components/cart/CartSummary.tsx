import { useState } from "react";
import { Button } from "@/ui/button";
import { Spinner } from "@/ui/spinner";
import { AlertCircle, Plus, Check, CreditCard } from "lucide-react";
import { useCartContext } from "../../context/pos-cart-context";
import { usePaymentRows } from "../../hooks/use-payment-rows";
import DiscountInput from "./DiscountInput";
import PaymentRow from "./PaymentRow";

export default function CartSummary() {
  const {
    cart, subtotal, discount, total, payments,
    paidAmount, change, note, isPending, checkoutIssue, canCheckout,
    setDiscount, setPayments, setNote, handleCheckout,
  } = useCartContext();

  const [showNote, setShowNote] = useState(false);

  const remaining = Math.max(0, total - paidAmount);
  const isFullyPaid = total > 0 && paidAmount >= total;
  const hasCash = payments.some((p) => p.method === "cash");

  const { addRow, removeRow, updateRow, toggleMethod } = usePaymentRows(payments, total, setPayments);

  return (
    <div className="grid max-h-[24rem] grid-rows-[minmax(0,1fr)_auto] border-t border-border bg-muted/50">
      <div className="min-h-0 space-y-3 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg border border-border/70 bg-background px-3 py-2">
            <div className="text-xs text-muted-foreground">المجموع الفرعي</div>
            <div className="font-semibold">{subtotal.toFixed(2)} ر.س</div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background px-3 py-2">
            <div className="text-xs text-muted-foreground">الإجمالي</div>
            <div className="font-bold text-foreground">{total.toFixed(2)} ر.س</div>
          </div>
        </div>

        <div className="text-sm">
          <DiscountInput subtotal={subtotal} discount={discount} onDiscountChange={setDiscount} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">طرق الدفع</span>
            {!isFullyPaid && cart.length > 0 && (
              <button
                onClick={addRow}
                disabled={isPending}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="w-3 h-3" />
                إضافة طريقة دفع
              </button>
            )}
          </div>

          <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
            {payments.map((p, i) => {
              const others = payments.reduce(
                (s, pp, idx) => s + (idx !== i ? Number(pp.amount) : 0),
                0,
              );
              const maxAllowed = Math.max(0, total - others);

              return (
                <PaymentRow
                  key={i}
                  payment={p}
                  index={i}
                  total={total}
                  totalPayments={payments.length}
                  maxAllowed={maxAllowed}
                  disabled={isPending}
                  onToggleMethod={toggleMethod}
                  onUpdateRow={updateRow}
                  onRemoveRow={removeRow}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-center text-xs ${
            isFullyPaid
              ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300"
              : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
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
          <div className="flex justify-between rounded-lg bg-green-500/10 px-3 py-1.5 text-xs">
            <span className="text-green-600 dark:text-green-400">الباقي للعميل</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {change.toFixed(2)} ر.س
            </span>
          </div>
        )}

        <button
          onClick={() => setShowNote(!showNote)}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {showNote ? "- إخفاء الملاحظات" : "+ إضافة ملاحظة"}
        </button>

        {showNote && (
          <textarea
            value={note}
            disabled={isPending}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ملاحظة للفاتورة..."
            className="h-16 w-full resize-none rounded-lg border border-border bg-background p-2 text-sm disabled:opacity-60"
          />
        )}

        {cart.length > 0 && checkoutIssue && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{checkoutIssue}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card p-3">
        <Button
          className="h-12 w-full text-base font-bold shadow-lg shadow-primary/20"
          size="lg"
          disabled={!canCheckout}
          onClick={handleCheckout}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" />
              جاري المعالجة...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إتمام الدفع
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
