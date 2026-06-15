import { MedicineUnit } from "./Medicine";

export interface GetStockAlertQuery {
  LowStockThreshold: number | null;
  ExpiringDays: number | null;
  page?: number;
  limit?: number;
  search?: string | null;
}

export interface StockAlertDto {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  categoryName: string | null;
  unit: MedicineUnit | null;
  totalQuantity: number;
  status: "متوفر" | "مخزون منخفض" | "حرج";
  nearestExpireDate: string | null;
  isExpiring: boolean;
}

export interface StockAlertResponse {
  items: StockAlertDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BatchStockDto {
  batchId: number;
  batchNumber: string | null;
  quantityEntered: number;
  quantityRemaining: number;
  purchasePrice: number;
  sellPrice: number;
  expireDate: string | null;
}

export interface StockWithBatchesDto {
  medicineId: number;
  medicineName: string;
  totalStock: number;
  batches: BatchStockDto[];
}

export interface AdjustmentRequest {
  medicineId: number;
  batchId: number;
  quantity: number;
  type: number; // StockMovementType as int
  userId: number;
  reason?: string;
}

export interface AdjustmentWithStockMovementDto {
  adjustmentId: number;
  medicineId: number;
  batchId: number;
  quantity: number;
  type: number;
  reason: string | null;
  createdAt: string;
  medicineName: string;
  batchNumber: string | null;
}
