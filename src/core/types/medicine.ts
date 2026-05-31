export enum MedicineUnit {
  Box = 1,
  Strip = 2,
  Pill = 3,
  Bottle = 4,
  Ampoule = 5,
  Vial = 6,
  Tube = 7,
  Sachet = 8,
  Inhaler = 9,
  Patch = 10,
}

export interface MedicineDto {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  categoryId: number | null;
  categoryName?: string;
  unit: MedicineUnit | null;
  isActive: boolean;
  createdAt: string;
}

export interface MedicineListResponse {
  medicines: MedicineDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateMedicineRequest {
  name: string;
  arabicName?: string;
  barcode?: string;
  categoryId?: number;
  unit?: number; // short sent as number
}

export interface UpdateMedicineRequest {
  name?: string;
  arabicName?: string;
  barcode?: string;
  categoryId?: number;
  unit?: number;
}

export interface PosMedicineDto {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  unit: MedicineUnit | null;
  categoryName: string | null;
  sellPrice: number;
  quantityRemaining: number;
  batchId: number;
  expiryDate: string | null;
}

export interface StockWithBatchesDto {
  medicineId: number;
  name: string;
  totalQuantity: number;
  batches: BatchDto[];
}

export interface BatchDto {
  batchId: number;
  batchNumber: string | null;
  quantityRemaining: number;
  sellPrice: number;
  purchasePrice: number;
  expireDate: string | null;
}
