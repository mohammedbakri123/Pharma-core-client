import { useState } from "react";
import { ShoppingBasket, User, Trash2, AlertTriangle } from "lucide-react";
import { useCartContext } from "../../context/pos-cart-context";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const {
    cart,
    selectedCustomer,
    setShowCustomerSelect,
    clearCart,
  } = useCartContext();

  function handleClear() {
    clearCart();
    setShowClearConfirm(false);
  }

  return (
    <aside className="flex h-dvh flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
      <div className="shrink-0 border-b border-border/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBasket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">الطلب الحالي</h3>
              <p className="text-[11px] text-muted-foreground">
                {cart.length === 0
                  ? "لا توجد أصناف"
                  : `${cart.length} ${cart.length === 1 ? "صنف" : "أصناف"}`}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-1">
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-destructive">تفريغ؟</span>
                  <button
                    onClick={handleClear}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
                    title="تأكيد التفريغ"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                    title="إلغاء"
                  >
                    <span className="text-xs font-medium">X</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="تفريغ السلة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCustomerSelect(true)}
          className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-border/50 bg-background/50 px-3 text-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.03]"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="truncate text-sm font-medium">
            {selectedCustomer ? selectedCustomer.name : "عميل نقدي"}
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/30 bg-card">
              <ShoppingBasket className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground/60">السلة فارغة</p>
              <p className="text-xs text-muted-foreground/40">أضف منتجاتك الأولى من القائمة</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {cart.map((item, i) => (
              <div
                key={item.medicineId}
                className="animate-in fade-in slide-in-from-left-2 duration-200"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: "both" }}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <CartSummary />
    </aside>
  );
}
