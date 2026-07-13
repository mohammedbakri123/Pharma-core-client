import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartContext } from "../../context/pos-cart-context";
import type { PosCartItem } from "../../types/pos";

interface CartItemProps {
  item: PosCartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartContext();
  const atStockLimit = item.quantity >= item.availableStock;

  return (
    <div className="group relative flex items-center gap-2 rounded-xl border border-border/40 bg-background/50 px-2.5 py-2 text-right transition-all duration-150 hover:border-border/80 hover:bg-background/80 sm:grid sm:grid-cols-[minmax(0,1fr)_6.5rem_5.5rem] sm:px-3 sm:py-2.5">
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold leading-tight">{item.name}</h4>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground/60">
          <span className="tabular-nums">{item.price.toFixed(2)} ر.س</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/20" />
          <span>متاح {item.availableStock}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-center">
        <div className="flex h-7 items-center gap-0 rounded-full border border-border/60 bg-background p-0.5 shadow-sm sm:h-8">
          <button
            onClick={() => updateQuantity(item.medicineId, -1)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-7 sm:w-7"
          >
            <Minus className="h-3 w-3" />
          </button>

          <span className="flex min-w-[1.5rem] items-center justify-center text-sm font-bold tabular-nums sm:min-w-[1.75rem]">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.medicineId, 1)}
            disabled={atStockLimit}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary/20 disabled:opacity-30 disabled:hover:bg-primary/10 sm:h-7 sm:w-7"
            title={atStockLimit ? "الحد الأقصى" : "إضافة"}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:hidden">
          <div className="text-left">
            <div className="text-sm font-bold tabular-nums tracking-tight">
              {(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="text-[10px] text-muted-foreground/50">ر.س</div>
          </div>
          <button
            onClick={() => removeFromCart(item.medicineId)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="حذف"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-2 sm:flex">
        <div className="text-left">
          <div className="text-sm font-bold tabular-nums tracking-tight">
            {(item.price * item.quantity).toFixed(2)}
          </div>
          <div className="text-[10px] text-muted-foreground/50">ر.س</div>
        </div>

        <button
          onClick={() => removeFromCart(item.medicineId)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/30 opacity-0 transition-all duration-150 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          title="حذف"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
