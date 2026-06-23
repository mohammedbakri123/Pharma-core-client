import { useQuery } from "@tanstack/react-query";
import { searchMedicines, scanBarcode, quickStock } from "../api/pos";

export function useSearchMedicines(q: string) {
  return useQuery({
    queryKey: ["pos-search", q],
    queryFn: async () => {
      const res = await searchMedicines(q);
      return res.data;
    },
    enabled: q.length >= 2,
  });
}

export function useScanBarcode(barcode: string) {
  return useQuery({
    queryKey: ["pos-scan", barcode],
    queryFn: async () => {
      const res = await scanBarcode(barcode);
      return res.data;
    },
    enabled: !!barcode,
  });
}

export function useQuickStock(medicineId: number | undefined) {
  return useQuery({
    queryKey: ["pos-quick-stock", medicineId],
    queryFn: async () => {
      const res = await quickStock(medicineId!);
      return res.data;
    },
    enabled: !!medicineId,
  });
}
