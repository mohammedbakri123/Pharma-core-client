import { api } from "@/api/client";
import type { PosMedicine, PosStock } from "../types/pos";

export const searchMedicines = (q: string) =>
  api.get<PosMedicine[]>("/pos/search", { params: { q } });

export const scanBarcode = (barcode: string) =>
  api.get<PosMedicine>(`/pos/scan/${encodeURIComponent(barcode)}`);

export const quickStock = (medicineId: number) =>
  api.get<PosStock>(`/pos/quick-stock/${medicineId}`);
