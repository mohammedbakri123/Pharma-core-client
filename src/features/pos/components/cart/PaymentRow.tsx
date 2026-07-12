import { CreditCard, Banknote, X } from "lucide-react";
import type { PosPaymentRequest } from "../../types/pos";

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  card: "بطاقة",
};

type PaymentRowField = keyof PosPaymentRequest;

interface PaymentRowProps {
  payment: PosPaymentRequest;
  index: number;
  total: number;
  totalPayments: number;
  maxAllowed: number;
  disabled?: boolean;
  onToggleMethod: (i: number) => void;
  onUpdateRow: (i: number, field: PaymentRowField, value: PosPaymentRequest[PaymentRowField]) => void;
  onRemoveRow: (i: number) => void;
}

export default function PaymentRow({
  payment,
  index,
  totalPayments,
  maxAllowed,
  disabled = false,
  onToggleMethod,
  onUpdateRow,
  onRemoveRow,
}: PaymentRowProps) {
  const parseAmount = (value: string) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
  };

  const isCard = payment.method === "card";
  const atCardLimit = isCard && maxAllowed <= 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-xl border border-border/40 bg-background/30 p-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => onToggleMethod(index)}
            disabled={disabled}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-150 ${
              !isCard
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Banknote className="h-3.5 w-3.5" />
            {methodLabels.cash}
          </button>
          <button
            onClick={() => onToggleMethod(index)}
            disabled={disabled}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-150 ${
              isCard
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {methodLabels.card}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            step={0.5}
            value={payment.amount}
            disabled={disabled || atCardLimit}
            onChange={(e) => {
              const val = parseAmount(e.target.value);
              const capped = isCard ? Math.min(val, maxAllowed) : val;
              onUpdateRow(index, "amount", capped);
            }}
            className="h-8 flex-1 rounded-lg border border-border/50 bg-background px-2 text-left text-sm tabular-nums transition-colors focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[11px] text-muted-foreground">ر.س</span>
        </div>

        {isCard && maxAllowed > 0 && (
          <p className="mt-1 text-right text-[10px] text-muted-foreground/50">
            الحد الأقصى للبطاقة: {maxAllowed.toFixed(2)} ر.س
          </p>
        )}
        {isCard && atCardLimit && (
          <p className="mt-1 text-right text-[10px] text-amber-500">تم الوصول للحد الأقصى للبطاقة</p>
        )}
      </div>

      {totalPayments > 1 && (
        <button
          onClick={() => onRemoveRow(index)}
          disabled={disabled}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
