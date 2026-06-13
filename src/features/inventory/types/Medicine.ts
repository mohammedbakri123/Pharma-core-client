export enum MedicineUnit {
  Box = "box",
  Strip = "strip",
  Pill = "pill",
  Bottle = "bottle",
  Ampoule = "ampoule",
  Vial = "vial",
  Tube = "tube",
  Sachet = "sachet",
  Inhaler = "inhaler",
  Patch = "patch",
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

export interface GetMedicinesRequest {
  page?: number;
  limit?: number;
  unit?: MedicineUnit;
  categoryId: number;
  search?: string;
}
///TODO: this shouldn't be here any way

// export interface PosMedicineDto {
//   medicineId: number;
//   name: string;
//   arabicName: string | null;
//   barcode: string | null;
//   unit: MedicineUnit | null;
//   categoryName: string | null;
//   sellPrice: number;
//   quantityRemaining: number;
//   batchId: number;
//   expiryDate: string | null;
// }

// export interface StockWithBatchesDto {
//   medicineId: number;
//   name: string;
//   totalQuantity: number;
//   batches: BatchDto[];
// }

// export interface BatchDto {
//   batchId: number;
//   batchNumber: string | null;
//   quantityRemaining: number;
//   sellPrice: number;
//   purchasePrice: number;
//   expireDate: string | null;
// }
