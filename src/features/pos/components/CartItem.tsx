import { Button } from "@/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCartContext } from "../context/pos-cart-context";
import type { PosCartItem } from "../types/pos";

interface CartItemProps {
  item: PosCartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartContext();

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300 text-right">
      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
        {item.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground">
          {item.price.toFixed(2)} ر.س / للوحدة
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => updateQuantity(item.medicineId, -1)}
        >
          <Minus className="w-3 h-3" />
        </Button>

        <span className="w-4 text-center text-sm font-medium">
          {item.quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => updateQuantity(item.medicineId, 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="text-left min-w-20">
        <div className="font-bold text-sm">
          {(item.price * item.quantity).toFixed(2)} ر.س
        </div>

        <button
          onClick={() => removeFromCart(item.medicineId)}
          className="text-destructive text-[10px] hover:underline"
        >
          حذف
        </button>
      </div>
    </div>
  );
}