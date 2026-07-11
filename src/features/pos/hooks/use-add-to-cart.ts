import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import inventoryApi from "@features/inventory/api/inventory";

export function useAddToCart(
  addItem: (medicineId: number, name: string, price: number, availableStock: number) => void,
  getProductName: (medicineId: number) => string | undefined,
) {
  return useCallback(
    async (medicineId: number) => {
      const name = getProductName(medicineId);
      if (!name) return;
      const stockRes = await inventoryApi.GetStockByMedicine(medicineId);
      const availableBatches = stockRes.data.batches.filter(
        (batch) => batch.quantityRemaining > 0,
      );
      const sellPrice = availableBatches[0]?.sellPrice ?? 0;

      if (stockRes.data.totalStock <= 0 || availableBatches.length === 0) {
        toast({
          title: "نفد المخزون",
          description: "لا يوجد مخزون متاح لهذا المنتج.",
          variant: "destructive",
        });
        return;
      }

      addItem(medicineId, name, sellPrice, stockRes.data.totalStock);
    },
    [addItem, getProductName],
  );
}
