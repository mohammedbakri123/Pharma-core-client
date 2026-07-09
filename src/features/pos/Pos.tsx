import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosProducts } from "./hooks/use-pos-products";
import { CartProvider, useCartContext } from "./context/pos-cart-context";
import POSSearch from "./components/POSSearch";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import ReceiptModal from "./components/ReceiptModal";
import CustomerSelect from "./components/CustomerSelect";

function POSContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { products, loading, initialLoading, hasMore, loadMore } =
    usePosProducts(debouncedSearch);

  const { showCustomerSelect, setShowCustomerSelect, setSelectedCustomer, receipt, setReceipt } =
    useCartContext();

  const getProductName = useCallback(
    (medicineId: number) => {
      const product = products.find((p) => p.medicineId === medicineId);
      return product ? (product.arabicName ?? product.name) : undefined;
    },
    [products],
  );

  return (
    <>
      <div className="flex h-[calc(100vh-8rem)] gap-6" dir="rtl">
        <div className="flex-1 flex flex-col gap-4">
          <POSSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ProductGrid
            products={products}
            getProductName={getProductName}
            loading={loading}
            initialLoading={initialLoading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>

        <Cart />
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