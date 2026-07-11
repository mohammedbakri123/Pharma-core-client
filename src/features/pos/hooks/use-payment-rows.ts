import { useCallback } from "react";
import type { PosPaymentRequest } from "../types/pos";

type PaymentRowField = keyof PosPaymentRequest;

function toAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? Math.max(0, amount) : 0;
}

export function usePaymentRows(
  payments: PosPaymentRequest[],
  total: number,
  setPayments: (payments: PosPaymentRequest[]) => void,
) {
  const addRow = useCallback(() => {
    const paid = payments.reduce((s: number, p: PosPaymentRequest) => s + toAmount(p.amount), 0);
    setPayments([...payments, { method: "cash", amount: Math.max(0, total - paid) }]);
  }, [payments, total, setPayments]);

  const removeRow = useCallback(
    (i: number) => setPayments(payments.filter((_, idx) => idx !== i)),
    [payments, setPayments],
  );

  const updateRow = useCallback(
    (i: number, field: PaymentRowField, value: PosPaymentRequest[PaymentRowField]) => {
      const next = payments.map((p, idx) =>
        idx === i ? { ...p, [field]: value } : p,
      );

      if (field === "amount") {
        const others = next.reduce(
          (s, p, idx) => s + (idx !== i ? toAmount(p.amount) : 0),
          0,
        );
        const maxAllowed = Math.max(0, total - others);
        if (next[i]!.method === "card") {
          next[i] = { method: "card", amount: Math.min(toAmount(value), maxAllowed) };
        } else {
          next[i] = { ...next[i]!, amount: toAmount(value) };
        }
      }

      setPayments(next);
    },
    [payments, total, setPayments],
  );

  const toggleMethod = useCallback(
    (i: number) => {
      const current = payments[i]!;
      const newMethod = current.method === "cash" ? "card" : "cash";
      if (newMethod === "card") {
        const others = payments.reduce(
          (s, p, idx) => s + (idx !== i ? toAmount(p.amount) : 0),
          0,
        );
        const maxAllowed = Math.max(0, total - others);
        const next = [...payments];
        next[i] = { method: "card", amount: Math.min(toAmount(current.amount), maxAllowed) };
        setPayments(next);
      } else {
        updateRow(i, "method", "cash");
      }
    },
    [payments, total, setPayments, updateRow],
  );

  return { addRow, removeRow, updateRow, toggleMethod };
}
