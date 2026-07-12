import { useState } from "react";
import { AlertCircle, Plus, Check, CreditCard, Banknote, Loader2 } from "lucide-react";
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
  const paymentRatio = total > 0 ? Math.min(1, paidAmount / total) : 0;

  const { addRow, removeRow, updateRow, toggleMethod } = usePaymentRows(payments, total, setPayments);

  return (
    <div className="flex max-h-[45dvh] flex-col border-t border-border/50">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {cart.length > 0 && (
          <>
            <div className="rounded-xl border border-border/40 bg-background/50 p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-semibold tabular-nums">{subtotal.toFixed(2)} ر.س</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الخصم</span>
                    <span className="font-medium text-destructive tabular-nums">-{discount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="border-t border-border/40 pt-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">الإجمالي</span>
                  <span className="text-base font-bold tabular-nums tracking-tight text-primary">
                    {total.toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </div>

            <DiscountInput subtotal={subtotal} discount={discount} onDiscountChange={setDiscount} />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">طرق الدفع</span>
                {!isFullyPaid && (
                  <button
                    onClick={addRow}
                    disabled={isPending}
                    className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Plus className="h-3 w-3" />
                    إضافة
                  </button>
                )}
              </div>

              {payments.length > 0 && (
                <div className="h-1.5 overflow-hidden rounded-full bg-border/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
                    style={{ width: `${paymentRatio * 100}%` }}
                  />
                </div>
              )}

              <div className="space-y-2">
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
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
                isFullyPaid
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {isFullyPaid ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>تمت التغطية</span>
                </>
              ) : (
                <span>المتبقي: {remaining.toFixed(2)} ر.س</span>
              )}
            </div>

            {isFullyPaid && hasCash && change > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Banknote className="h-3.5 w-3.5" />
                  الباقي للعميل
                </span>
                <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {change.toFixed(2)} ر.س
                </span>
              </div>
            )}

            <button
              onClick={() => setShowNote(!showNote)}
              className="w-full text-right text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {showNote ? "إخفاء الملاحظات" : "+ إضافة ملاحظة"}
            </button>

            {showNote && (
              <textarea
                value={note}
                disabled={isPending}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ملاحظة للفاتورة..."
                className="h-16 w-full resize-none rounded-xl border border-border/50 bg-background/50 p-2.5 text-sm transition-colors focus:border-primary/30 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-60"
              />
            )}

            {checkoutIssue && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{checkoutIssue}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border/50 bg-card p-3">
        <button
          disabled={!canCheckout || cart.length === 0}
          onClick={handleCheckout}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري المعالجة...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إتمام الدفع
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
