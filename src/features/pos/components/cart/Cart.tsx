import { CreditCard, ShoppingBasket, User, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { useCartContext } from "../../context/pos-cart-context";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart() {
  const {
    cart,
    selectedCustomer,
    setShowCustomerSelect,
    clearCart,
  } = useCartContext();

  return (
    <aside className="grid min-h-0 grid-rows-[auto_minmax(12rem,1fr)_auto] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="border-b border-border bg-muted/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBasket className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold leading-5">الطلب الحالي</h3>
              <p className="text-xs text-muted-foreground">{cart.length} صنف</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={clearCart}
                title="تفريغ السلة"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowCustomerSelect(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm transition-colors hover:border-primary/50"
        >
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="truncate text-muted-foreground">
            {selectedCustomer ? selectedCustomer.name : "عميل نقدي"}
          </span>
        </button>
      </div>

      <ScrollArea className="min-h-0">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center space-y-2 p-4 text-muted-foreground opacity-50">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <p>السلة فارغة</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {cart.map((item) => (
              <CartItem key={item.medicineId} item={item} />
            ))}
          </div>
        )}
      </ScrollArea>

      <CartSummary />
    </aside>
  );
}
