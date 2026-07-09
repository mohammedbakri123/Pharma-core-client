import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { usePosCheckout } from "../hooks/use-pos-checkout";
import type { PosCartItem, PosCheckoutResultDto, PosPaymentRequest } from "../types/pos";

function defaultPayments(): PosPaymentRequest[] {
  return [{ method: "cash" as const, amount: 0 }];
}

interface CartContextValue {
  cart: PosCartItem[];
  payments: PosPaymentRequest[];
  discount: number;
  note: string;
  selectedCustomer: { id: number; name: string } | null;
  receipt: PosCheckoutResultDto | null;
  subtotal: number;
  total: number;
  paidAmount: number;
  change: number;
  isPending: boolean;
  showCustomerSelect: boolean;

  addItem: (medicineId: number, name: string, price: number) => void;
  updateQuantity: (medicineId: number, delta: number) => void;
  removeFromCart: (medicineId: number) => void;
  clearCart: () => void;
  setPayments: (payments: PosPaymentRequest[]) => void;
  setDiscount: (discount: number) => void;
  setNote: (note: string) => void;
  setSelectedCustomer: (customer: { id: number; name: string } | null) => void;
  setShowCustomerSelect: (open: boolean) => void;
  setReceipt: (receipt: PosCheckoutResultDto | null) => void;
  handleCheckout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [payments, setPayments] = useState<PosPaymentRequest[]>([]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [receipt, setReceipt] = useState<PosCheckoutResultDto | null>(null);

  const checkout = usePosCheckout();

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const paidAmount = payments.reduce((s, p) => s + p.amount, 0);
  const change = Math.max(0, paidAmount - total);

  useEffect(() => {
    if (cart.length > 0 && payments.length === 0) {
      setPayments(defaultPayments());
    }
  }, [cart.length]);

  const addItem = useCallback((medicineId: number, name: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.medicineId === medicineId);
      if (existing)
        return prev.map((i) =>
          i.medicineId === medicineId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [...prev, { medicineId, name, price, quantity: 1 }];
    });
  }, []);

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

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
    setPayments([]);
    setNote("");
    setSelectedCustomer(null);
  }, []);

  const handleCheckout = useCallback(() => {
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
  }, [cart, payments, discount, note, selectedCustomer, checkout]);

  return (
    <CartContext.Provider
      value={{
        cart,
        payments,
        discount,
        note,
        selectedCustomer,
        receipt,
        subtotal,
        total,
        paidAmount,
        change,
        isPending: checkout.isPending,
        showCustomerSelect,
        addItem,
        updateQuantity,
        removeFromCart,
        clearCart,
        setPayments,
        setDiscount,
        setNote,
        setSelectedCustomer,
        setShowCustomerSelect,
        setReceipt,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
}