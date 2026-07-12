import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosProducts } from "./hooks/use-pos-products";
import { CartProvider, useCartContext } from "./context/pos-cart-context";
import POSSearch from "./components/POSSearch";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/cart/Cart";
import ReceiptModal from "./components/ReceiptModal";
import CustomerSelect from "./components/cart/CustomerSelect";

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
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 xl:gap-4 xl:p-4">
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

        <div className="w-[28rem] min-w-0 shrink-0 animate-in fade-in slide-in-from-left-3 duration-500 delay-200 [animation-fill-mode:both]">
          <Cart />
        </div>
      </div>

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
