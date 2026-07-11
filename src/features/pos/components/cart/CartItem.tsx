import { Button } from "@/ui/button";
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
    <div className="grid grid-cols-[minmax(0,1fr)_5.75rem_4.75rem_auto] items-center gap-2 rounded-lg border border-border/70 bg-background p-2 text-right shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="min-w-0">
        <h4 className="truncate text-sm font-medium leading-5">{item.name}</h4>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
          <span>{item.price.toFixed(2)} ر.س</span>
          <span>المتاح {item.availableStock}</span>
        </div>
      </div>

      <div className="grid h-8 grid-cols-[1.75rem_1fr_1.75rem] items-center rounded-full border border-border bg-muted/40">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-0 bg-transparent shadow-none hover:bg-background"
          onClick={() => updateQuantity(item.medicineId, -1)}
        >
          <Minus className="w-3 h-3" />
        </Button>

        <span className="text-center text-sm font-semibold tabular-nums">
          {item.quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-0 bg-transparent shadow-none hover:bg-background"
          disabled={atStockLimit}
          onClick={() => updateQuantity(item.medicineId, 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="text-left">
        <div className="text-sm font-bold leading-5">
          {(item.price * item.quantity).toFixed(2)} ر.س
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => removeFromCart(item.medicineId)}
        title="حذف"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
