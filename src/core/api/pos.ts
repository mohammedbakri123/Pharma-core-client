import api from "./client";
import type { PosMedicineDto } from "@/types";

export const posSearch = (q: string) =>
  api.get<PosMedicineDto[]>("/pos/search", { params: { q } });

export const posScan = (barcode: string) =>
  api.get<PosMedicineDto>(`/pos/scan/${encodeURIComponent(barcode)}`);

export const posQuickStock = (medicineId: number) =>
  api.get(`/pos/quick-stock/${medicineId}`);
