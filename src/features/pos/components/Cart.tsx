import { CreditCard, User, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  selectedCustomer,
  onCustomerClick,
  payments,
  onPaymentsChange,
  discount,
  onDiscountChange,
  note,
  onNoteChange,
  subtotal,
  total,
  paidAmount,
  change,
  onCheckout,
  onClearCart,
  isPending,
}: any) {
  return (
    <div className="w-100 bg-card rounded-xl shadow-xl border border-border flex flex-col overflow-hidden">
      <div className="p-4 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-lg">الطلب الحالي</h3>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onClearCart}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={onCustomerClick}
          className="flex items-center gap-1.5 text-sm bg-card px-2.5 py-1.5 rounded border hover:border-primary/50 transition-colors w-full"
        >
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {selectedCustomer ? selectedCustomer.name : "عميل نقدي"}
          </span>
        </button>
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
              key={item.medicineId}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))
        )}
      </div>

      <CartSummary
        subtotal={subtotal}
        discount={discount}
        onDiscountChange={onDiscountChange}
        total={total}
        payments={payments}
        onPaymentsChange={onPaymentsChange}
        paidAmount={paidAmount}
        change={change}
        note={note}
        onNoteChange={onNoteChange}
        cart={cart}
        onCheckout={onCheckout}
        isPending={isPending}
      />
    </div>
  );
}
