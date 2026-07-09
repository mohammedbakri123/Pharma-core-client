import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePosProducts } from "./hooks/use-pos-products";
import { usePosCheckout } from "./hooks/use-pos-checkout";
import inventoryApi from "@features/inventory/api/inventory";
import POSSearch from "./components/POSSearch";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import ReceiptModal from "./components/ReceiptModal";
import CustomerSelect from "./components/CustomerSelect";
import type { PosCheckoutResultDto, PosPaymentRequest } from "./types/pos";

interface CartItem {
  medicineId: number;
  name: string;
  price: number;
  quantity: number;
}

function defaultPayments(total: number): PosPaymentRequest[] {
  return [{ method: "cash" as const, amount: total }];
}

export default function POS() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { products, loading, initialLoading, hasMore, loadMore } =
    usePosProducts(debouncedSearch);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [payments, setPayments] = useState<PosPaymentRequest[]>([]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  const checkout = usePosCheckout();
  const [receipt, setReceipt] = useState<PosCheckoutResultDto | null>(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const paidAmount = payments.reduce((s, p) => s + p.amount, 0);
  const change = Math.max(0, paidAmount - total);

  useEffect(() => {
    if (cart.length > 0 && payments.length === 0) {
      setPayments(defaultPayments(total));
    }
  }, [cart.length]);

  const addToCart = useCallback(
    async (medicineId: number) => {
      const product = products.find((p) => p.medicineId === medicineId);
      if (!product) return;

      setAddingIds((prev) => new Set(prev).add(medicineId));
      try {
        const stockRes = await inventoryApi.GetStockByMedicine(medicineId);
        const sellPrice = stockRes.data.batches[0]?.sellPrice ?? 0;

        setCart((prev) => {
          const existing = prev.find((i) => i.medicineId === medicineId);
          if (existing)
            return prev.map((i) =>
              i.medicineId === medicineId
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            );
          return [
            ...prev,
            {
              medicineId,
              name: product.arabicName ?? product.name,
              price: sellPrice,
              quantity: 1,
            },
          ];
        });
      } finally {
        setAddingIds((prev) => {
          const next = new Set(prev);
          next.delete(medicineId);
          return next;
        });
      }
    },
    [products],
  );

  const updateQuantity = useCallback((medicineId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.medicineId === medicineId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((medicineId: number) => {
    setCart((prev) => prev.filter((i) => i.medicineId !== medicineId));
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const validPayments = payments.filter((p) => p.amount > 0);
    if (validPayments.length === 0) return;

    checkout.mutate(
      {
        items: cart.map((i) => ({
          medicineId: i.medicineId,
          quantity: i.quantity,
        })),
        payments: validPayments,
        customerId: selectedCustomer?.id,
        discount,
        note: note || undefined,
      },
      {
        onSuccess: (result) => {
          setReceipt(result);
          setCart([]);
          setDiscount(0);
          setPayments([]);
          setNote("");
          setSelectedCustomer(null);
        },
      },
    );
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
    setPayments([]);
    setNote("");
  }, []);

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
            addToCart={addToCart}
            addingIds={addingIds}
            loading={loading}
            initialLoading={initialLoading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>

        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          selectedCustomer={selectedCustomer}
          onCustomerClick={() => setShowCustomerSelect(true)}
          payments={payments}
          onPaymentsChange={setPayments}
          discount={discount}
          onDiscountChange={setDiscount}
          note={note}
          onNoteChange={setNote}
          subtotal={subtotal}
          total={total}
          paidAmount={paidAmount}
          change={change}
          onCheckout={handleCheckout}
          onClearCart={clearCart}
          isPending={checkout.isPending}
        />
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
