import { useState, useCallback } from "react";
import { ShoppingBasket } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosProducts } from "./hooks/use-pos-products";
import { CartProvider, useCartContext } from "./context/pos-cart-context";
import POSSearch from "./components/POSSearch";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/cart/Cart";
import ReceiptModal from "./components/ReceiptModal";
import CustomerSelect from "./components/cart/CustomerSelect";

function MobileCartButton() {
  const { cart, subtotal, setShowMobileCart } = useCartContext();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => setShowMobileCart(true)}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-2xl shadow-primary/30 transition-all active:scale-95 lg:hidden"
    >
      <div className="relative">
        <ShoppingBasket className="h-5 w-5" />
        <span className="absolute -left-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-foreground px-1 text-[10px] font-bold text-primary">
          {itemCount}
        </span>
      </div>
      <span className="text-sm font-bold tabular-nums">{subtotal.toFixed(2)} ر.س</span>
    </button>
  );
}

function POSContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { products, loading, initialLoading, hasMore, loadMore } =
    usePosProducts(debouncedSearch);

  const {
    showCustomerSelect,
    setShowCustomerSelect,
    setSelectedCustomer,
    receipt,
    setReceipt,
  } = useCartContext();

  const getProductName = useCallback(
    (medicineId: number) => {
      const product = products.find((p) => p.medicineId === medicineId);
      return product ? (product.arabicName ?? product.name) : undefined;
    },
    [products],
  );

  return (
    <>
      <div
        className="flex h-dvh animate-in fade-in duration-500"
        dir="rtl"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-2 sm:gap-3 sm:p-3 lg:gap-4 lg:p-4">
          <div className="shrink-0 animate-in fade-in slide-in-from-top-2 duration-400">
            <POSSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="min-h-0 flex-1 animate-in fade-in duration-500 delay-150 [animation-fill-mode:both]">
            <ProductGrid
              products={products}
              getProductName={getProductName}
              loading={loading}
              initialLoading={initialLoading}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          </div>
        </div>

        <div className="hidden w-[28rem] min-w-0 shrink-0 animate-in fade-in slide-in-from-left-3 duration-500 delay-200 [animation-fill-mode:both] lg:block">
          <Cart />
        </div>
      </div>

      <MobileCartButton />

      <Cart mobile />

      <CustomerSelect
        open={showCustomerSelect}
        onOpenChange={setShowCustomerSelect}
        onSelect={setSelectedCustomer}
      />

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}

export default function POS() {
  return (
    <CartProvider>
      <POSContent />
    </CartProvider>
  );
}
