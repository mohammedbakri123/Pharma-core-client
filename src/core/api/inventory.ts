import api from "./client";
import type {
  StockListResponse,
  StockWithBatchesDto,
  BatchDto,
  AdjustmentRequest,
  AdjustmentWithStockMovementDto,
} from "@/types";

// Inventory stock
export const getStock = (params?: {
  page?: number;
  limit?: number;
  medicineId?: number;
}) => api.get<StockListResponse>("/inventory/stock", { params });

export const getStockByMedicine = (medicineId: number) =>
  api.get<StockWithBatchesDto>(`/inventory/stock/${medicineId}`);

// Batches
export const getBatchesByMedicine = (medicineId: number) =>
  api.get<{ batches: BatchDto[] }>(`/inventory/batches/${medicineId}`);

// Alerts
export const getLowStock = (threshold?: number) =>
  api.get<{ items: unknown[] }>("/inventory/low-stock", {
    params: { threshold },
  });

export const getExpiring = (daysUntilExpiry?: number) =>
  api.get<{ items: unknown[] }>("/inventory/expiring", {
    params: { daysUntilExpiry },
  });

// Adjustments
export const adjustStock = (data: AdjustmentRequest) =>
  api.post<AdjustmentWithStockMovementDto>("/inventory/adjust", data);
