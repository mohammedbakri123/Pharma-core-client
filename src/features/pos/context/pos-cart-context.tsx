import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
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
  checkoutIssue: string | null;
  canCheckout: boolean;

  addItem: (medicineId: number, name: string, price: number, availableStock: number) => void;
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

const MONEY_EPSILON = 0.005;

function isPositiveFinite(value: number) {
  return Number.isFinite(value) && value > 0;
}

function normalizeMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function getCheckoutIssue({
  cart,
  payments,
  discount,
  subtotal,
  total,
  paidAmount,
  selectedCustomer,
}: {
  cart: PosCartItem[];
  payments: PosPaymentRequest[];
  discount: number;
  subtotal: number;
  total: number;
  paidAmount: number;
  selectedCustomer: { id: number; name: string } | null;
}) {
  if (cart.length === 0) return "أضف منتجاً واحداً على الأقل";
  if (selectedCustomer && (!Number.isInteger(selectedCustomer.id) || selectedCustomer.id <= 0)) {
    return "بيانات العميل غير صحيحة";
  }

  const invalidItem = cart.find(
    (item) =>
      !Number.isInteger(item.medicineId) ||
      item.medicineId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      !isPositiveFinite(item.price) ||
      !Number.isInteger(item.availableStock) ||
      item.availableStock <= 0,
  );
  if (invalidItem) return "يوجد صنف غير صالح في السلة";

  const overStockItem = cart.find((item) => item.quantity > item.availableStock);
  if (overStockItem) return `الكمية المطلوبة من ${overStockItem.name} أكبر من المخزون`;

  if (!isPositiveFinite(subtotal)) return "المجموع الفرعي غير صالح";
  if (!Number.isFinite(discount) || discount < 0) return "قيمة الخصم غير صحيحة";
  if (discount >= subtotal) return "الخصم يجب أن يكون أقل من المجموع الفرعي";
  if (!isPositiveFinite(total)) return "إجمالي الفاتورة يجب أن يكون أكبر من صفر";

  const invalidPayment = payments.find(
    (payment) =>
      (payment.method !== "cash" && payment.method !== "card") ||
      !Number.isFinite(payment.amount) ||
      payment.amount < 0,
  );
  if (invalidPayment) return "يوجد مبلغ دفع غير صالح";

  const validPayments = payments.filter((payment) => payment.amount > 0);
  if (validPayments.length === 0) return "أدخل مبلغ الدفع";
  if (paidAmount + MONEY_EPSILON < total) return "المبلغ المدفوع أقل من الإجمالي";

  const hasCashPayment = validPayments.some((payment) => payment.method === "cash");
  if (!hasCashPayment && paidAmount > total + MONEY_EPSILON) {
    return "لا يمكن دفع مبلغ أكبر من الإجمالي بالبطاقة فقط";
  }

  return null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [payments, setPayments] = useState<PosPaymentRequest[]>([]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [receipt, setReceipt] = useState<PosCheckoutResultDto | null>(null);

  const checkout = usePosCheckout();

  const subtotal = normalizeMoney(cart.reduce((s, i) => s + i.price * i.quantity, 0));
  const total = normalizeMoney(Math.max(0, subtotal - discount));
  const paidAmount = normalizeMoney(payments.reduce((s, p) => s + p.amount, 0));
  const change = Math.max(0, paidAmount - total);
  const checkoutIssue = useMemo(
    () =>
      getCheckoutIssue({
        cart,
        payments,
        discount,
        subtotal,
        total,
        paidAmount,
        selectedCustomer,
      }),
    [cart, payments, discount, subtotal, total, paidAmount, selectedCustomer],
  );
  const canCheckout = !checkoutIssue && !checkout.isPending;

  useEffect(() => {
    if (cart.length > 0 && payments.length === 0) {
      setPayments(defaultPayments());
    }
  }, [cart.length]);

  useEffect(() => {
    const maxDiscount = subtotal > 0 ? Math.max(0, subtotal - 0.01) : 0;
    if (discount > maxDiscount) {
      setDiscount(normalizeMoney(maxDiscount));
    }
  }, [discount, subtotal]);

  const addItem = useCallback((medicineId: number, name: string, price: number, availableStock: number) => {
    if (!Number.isInteger(medicineId) || medicineId <= 0 || !isPositiveFinite(price)) {
      toast({
        title: "لا يمكن إضافة المنتج",
        description: "بيانات السعر أو المنتج غير صحيحة.",
        variant: "destructive",
      });
      return;
    }

    const safeStock = Math.max(0, Math.floor(availableStock));
    if (safeStock <= 0) {
      toast({
        title: "نفد المخزون",
        description: "لا يمكن بيع منتج بدون مخزون متاح.",
        variant: "destructive",
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.medicineId === medicineId);
      if (existing) {
        if (existing.quantity >= safeStock) {
          toast({
            title: "الكمية غير متاحة",
            description: `المخزون المتاح من ${existing.name} هو ${safeStock}.`,
            variant: "destructive",
          });
          return prev;
        }

        return prev.map((i) =>
          i.medicineId === medicineId
            ? { ...i, price, availableStock: safeStock, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [...prev, { medicineId, name, price, availableStock: safeStock, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((medicineId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.medicineId === medicineId
            ? { ...i, quantity: Math.min(i.availableStock, Math.max(0, i.quantity + delta)) }
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
    if (checkout.isPending) return;
    if (checkoutIssue) {
      toast({
        title: "تعذر إتمام البيع",
        description: checkoutIssue,
        variant: "destructive",
      });
      return;
    }

    const validPayments = payments
      .filter((p) => p.amount > 0)
      .map((p) => ({ ...p, amount: normalizeMoney(p.amount) }));

    checkout.mutate(
      {
        items: cart.map((i) => ({
          medicineId: i.medicineId,
          quantity: i.quantity,
        })),
        payments: validPayments,
        customerId: selectedCustomer?.id,
        discount: normalizeMoney(discount),
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
  }, [cart, payments, discount, note, selectedCustomer, checkout, checkoutIssue]);

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
        checkoutIssue,
        canCheckout,
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
