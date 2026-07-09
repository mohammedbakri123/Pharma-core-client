interface DiscountInputProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
}

export default function DiscountInput({ subtotal, discount, onDiscountChange }: DiscountInputProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground shrink-0">الخصم</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={subtotal}
          step={0.5}
          value={discount}
          onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value)))}
          className="w-20 h-7 text-left text-sm bg-background rounded border border-border px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0.00"
        />
        <span className="text-xs text-muted-foreground">ر.س</span>
      </div>
    </div>
  );
}