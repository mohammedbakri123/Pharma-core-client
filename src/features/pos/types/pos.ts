export interface PosMedicine {
  medicineId: number;
  name: string;
  arabicName: string | null;
  barcode: string | null;
  unit: string | null;
  sellPrice: number;
  currentStock: number;
}

export interface PosBatch {
  batchId: number;
  batchNumber: string | null;
  quantityRemaining: number;
  sellPrice: number;
  expireDate: string | null;
}

export interface PosStock {
  medicineId: number;
  name: string;
  totalStock: number;
  batches: PosBatch[];
}
