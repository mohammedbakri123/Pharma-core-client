import { CreditCard, User } from "lucide-react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  subtotal,
  tax,
  total,
}: any) {
  return (
    <div className="w-[400px] bg-card rounded-xl shadow-xl border border-border flex flex-col overflow-hidden">
      <div className="p-4 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-lg">الطلب الحالي</h3>
          <div className="flex items-center text-sm text-muted-foreground bg-card px-2 py-1 rounded border">
            <User className="w-3 h-3 ml-1" />
            <span>عميل نقدي</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">رقم العملية #TRX-8842</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <p>السلة فارغة</p>
          </div>
        ) : (
          cart.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))
        )}
      </div>

      <CartSummary subtotal={subtotal} tax={tax} total={total} cart={cart} />
    </div>
  );
}
