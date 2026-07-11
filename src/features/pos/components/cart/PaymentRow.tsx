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

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 grid grid-cols-2 gap-2 bg-background rounded-lg border border-border p-2">
        <button
          onClick={() => onToggleMethod(index)}
          disabled={disabled}
          className={`flex items-center justify-center gap-1.5 text-xs h-8 rounded transition-colors ${
            payment.method === "cash"
              ? "bg-primary/10 text-primary font-medium"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          {methodLabels.cash}
        </button>
        <button
          onClick={() => onToggleMethod(index)}
          disabled={disabled}
          className={`flex items-center justify-center gap-1.5 text-xs h-8 rounded transition-colors ${
            payment.method === "card"
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
            value={payment.amount}
            disabled={disabled}
            onChange={(e) => {
              const val = parseAmount(e.target.value);
              const capped =
                payment.method === "card"
                  ? Math.min(val, maxAllowed)
                  : val;
              onUpdateRow(index, "amount", capped);
            }}
            className="w-full h-8 text-left text-sm bg-background rounded border border-border px-2 disabled:opacity-60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-muted-foreground shrink-0">ر.س</span>
        </div>
      </div>
      {totalPayments > 1 && (
        <button
          onClick={() => onRemoveRow(index)}
          disabled={disabled}
          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
