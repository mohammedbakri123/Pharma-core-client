interface DiscountInputProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
}

const quickDiscounts = [5, 10, 15];

export default function DiscountInput({ subtotal, discount, onDiscountChange }: DiscountInputProps) {
  const maxDiscount = Math.max(0, subtotal - 0.01);
  const discountPercent = subtotal > 0 ? (discount / subtotal) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground">الخصم</span>
        <div className="flex items-center gap-1.5">
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
            className="h-8 w-20 rounded-lg border border-border/50 bg-background/50 px-2 text-left text-sm tabular-nums transition-colors focus:border-primary/30 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
          />
          <div className="text-xs text-muted-foreground">
            {discount > 0 && (
              <span className="tabular-nums text-muted-foreground/60">
                ({discountPercent.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {subtotal > 0 && (
        <div className="flex gap-1.5">
          {quickDiscounts.map((percent) => {
            const amount = (subtotal * percent) / 100;
            const isActive = Math.abs(discount - amount) < 0.1;
            return (
              <button
                key={percent}
                onClick={() => onDiscountChange(isActive ? 0 : Math.min(amount, maxDiscount))}
                className={`flex-1 rounded-lg border py-1 text-[11px] font-medium transition-all duration-150 ${
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/40 text-muted-foreground/60 hover:border-border/60 hover:text-foreground/80"
                }`}
              >
                {percent}%
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
