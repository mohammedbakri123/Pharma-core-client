import { useCallback } from "react";
import inventoryApi from "@features/inventory/api/inventory";

export function useAddToCart(
  addItem: (medicineId: number, name: string, price: number) => void,
  getProductName: (medicineId: number) => string | undefined,
) {
  return useCallback(
    async (medicineId: number) => {
      const name = getProductName(medicineId);
      if (!name) return;
      const stockRes = await inventoryApi.GetStockByMedicine(medicineId);
      const sellPrice = stockRes.data.batches[0]?.sellPrice ?? 0;
      addItem(medicineId, name, sellPrice);
    },
    [addItem, getProductName],
  );
}