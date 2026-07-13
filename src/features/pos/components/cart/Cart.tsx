import { useState, useEffect } from "react";
import { ShoppingBasket, User, Trash2, AlertTriangle, X } from "lucide-react";
import { useCartContext } from "../../context/pos-cart-context";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function Cart({ mobile = false }: { mobile?: boolean }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const {
    cart,
    selectedCustomer,
    setShowCustomerSelect,
    clearCart,
    showMobileCart,
    setShowMobileCart,
  } = useCartContext();

  function handleClear() {
    clearCart();
    setShowClearConfirm(false);
  }

  useEffect(() => {
    if (showMobileCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileCart]);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (mobile) {
    return (
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          showMobileCart ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            showMobileCart ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowMobileCart(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-card shadow-2xl transition-transform duration-300 ease-out ${
            showMobileCart ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingBasket className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">الطلب الحالي</h3>
                <p className="text-[11px] text-muted-foreground">
                  {itemCount === 0
                    ? "لا توجد أصناف"
                    : `${itemCount} ${itemCount === 1 ? "صنف" : "أصناف"}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <div className="flex items-center gap-1">
                  {showClearConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-destructive">تفريغ؟</span>
                      <button
                        onClick={handleClear}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground"
                      >
                        <span className="text-xs font-medium">X</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowMobileCart(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setShowMobileCart(false);
              setShowCustomerSelect(true);
            }}
            className="mx-3 mt-3 flex h-10 items-center gap-2.5 rounded-xl border border-border/50 bg-background/50 px-3 text-sm transition-all duration-200 hover:border-primary/30"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <User className="h-3 w-3 text-primary" />
            </div>
            <span className="truncate text-sm font-medium">
              {selectedCustomer ? selectedCustomer.name : "عميل نقدي"}
            </span>
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/30 bg-card">
                  <ShoppingBasket className="h-7 w-7 text-muted-foreground/20" />
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
                    className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                    style={{ animationDelay: `${i * 20}ms`, animationFillMode: "both" }}
                  >
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <CartSummary />
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden h-dvh flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl lg:flex">
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
