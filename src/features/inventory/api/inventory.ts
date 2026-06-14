import api from "../../../core/api/client";
import type {
  StockListResponse,
  AdjustmentRequest,
  AdjustmentWithStockMovementDto,
} from "../types/inventory";

// Inventory stock
const getStock = (params?: {
  page?: number;
  limit?: number;
  medicineId?: number;
}) => api.get<StockListResponse>("/inventory/stock", { params });

const inventoryApi = {
  getStock,
  // getStockByMedicine,
  // getBatchesByMedicine,
  // getLowStock,
  // getExpiring,
  // adjustStock,
};

export default inventoryApi;

// export const getStockByMedicine = (medicineId: number) =>
//   api.get<StockWithBatchesDto>(`/inventory/stock/${medicineId}`);

// // Batches
// export const getBatchesByMedicine = (medicineId: number) =>
//   api.get<{ batches: BatchDto[] }>(`/inventory/batches/${medicineId}`);

// // Alerts
// export const getLowStock = (threshold?: number) =>
//   api.get<{ items: unknown[] }>("/inventory/low-stock", {
//     params: { threshold },
//   });

// export const getExpiring = (daysUntilExpiry?: number) =>
//   api.get<{ items: unknown[] }>("/inventory/expiring", {
//     params: { daysUntilExpiry },
//   });

// // Adjustments
// export const adjustStock = (data: AdjustmentRequest) =>
//   api.post<AdjustmentWithStockMovementDto>("/inventory/adjust", data);
