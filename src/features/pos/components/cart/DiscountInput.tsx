interface DiscountInputProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
}

export default function DiscountInput({ subtotal, discount, onDiscountChange }: DiscountInputProps) {
  const maxDiscount = Math.max(0, subtotal - 0.01);

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground shrink-0">الخصم</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={maxDiscount}
          step={0.5}
          value={discount}
          onChange={(e) => {
            const next = Number(e.target.value);
            const safeValue = Number.isFinite(next) ? next : 0;
            onDiscountChange(Math.min(maxDiscount, Math.max(0, safeValue)));
          }}
          className="w-20 h-7 text-left text-sm bg-background rounded border border-border px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0.00"
        />
        <span className="text-xs text-muted-foreground">ر.س</span>
      </div>
    </div>
  );
}
