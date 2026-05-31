export interface StockItemDto {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  categoryName: string | null;
  unit: number | null;
  totalQuantity: number;
  minStockLevel: number;
  status: "متوفر" | "مخزون منخفض" | "حرج";
}

export interface StockListResponse {
  stock: StockItemDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
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
