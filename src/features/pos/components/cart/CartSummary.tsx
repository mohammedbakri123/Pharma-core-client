import { useState } from "react";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Spinner } from "@/ui/spinner";
import { Plus, Check } from "lucide-react";
import { useCartContext } from "../../context/pos-cart-context";
import { usePaymentRows } from "../../hooks/use-payment-rows";
import DiscountInput from "./DiscountInput";
import PaymentRow from "./PaymentRow";

export default function CartSummary() {
  const {
    cart, subtotal, discount, total, payments,
    paidAmount, change, note, isPending,
    setDiscount, setPayments, setNote, handleCheckout,
  } = useCartContext();

  const [showNote, setShowNote] = useState(false);

  const remaining = Math.max(0, total - paidAmount);
  const isFullyPaid = paidAmount >= total;
  const hasCash = payments.some((p) => p.method === "cash");

  const { addRow, removeRow, updateRow, toggleMethod } = usePaymentRows(payments, total, setPayments);

  return (
    <div className="p-4 bg-muted/50 border-t border-border space-y-3">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>

        <DiscountInput subtotal={subtotal} discount={discount} onDiscountChange={setDiscount} />

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
              onToggleMethod={toggleMethod}
              onUpdateRow={updateRow}
              onRemoveRow={removeRow}
            />
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
          onChange={(e) => setNote(e.target.value)}
          placeholder="ملاحظة للفاتورة..."
          className="w-full h-16 resize-none text-sm bg-background rounded border border-border p-2"
        />
      )}

      <Button
        className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20"
        size="lg"
        disabled={cart.length === 0 || !isFullyPaid || isPending}
        onClick={handleCheckout}
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