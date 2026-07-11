import { MedicineUnit } from "./Medicine";

export interface GetStockAlertQuery {
  LowStockThreshold: number | null;
  ExpiringDays: number | null;
  page?: number;
  limit?: number;
  search?: string | null;
  ExcludeZeroStock?: boolean;
}

export enum StockStatus {
  Available = "available",
  LowStock = "lowStock",
  Critical = "critical",
}

export interface StockAlertDto {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  categoryName: string | null;
  unit: MedicineUnit | null;
  totalQuantity: number;
  status: StockStatus;
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


