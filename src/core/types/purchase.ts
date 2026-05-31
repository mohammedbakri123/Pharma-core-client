import { MedicineUnit } from "./medicine";

export enum PurchaseStatus {
  Draft = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface PurchaseItemDto {
  purchaseItemId: number;
  purchaseId: number;
  medicineId: number;
  batchId: number;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  expireDate: string | null;
  totalPrice: number;
  medicineName?: string;
}

export interface PurchaseDto {
  purchaseId: number;
  supplierId: number | null;
  supplierName?: string;
  invoiceNumber: string | null;
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: string;
  note: string | null;
}

export interface PurchaseDetailsDto extends PurchaseDto {
  items: PurchaseItemDto[];
}

export interface PurchaseListResponse {
  purchases: PurchaseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PurchaseBalanceDto {
  purchaseId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface CreatePurchaseRequest {
  supplierId?: number;
  invoiceNumber?: string;
  note?: string;
}

export interface UpdatePurchaseRequest {
  supplierId?: number;
  invoiceNumber?: string;
  note?: string;
}

export interface AddPurchaseItemRequest {
  medicineId: number;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  expireDate?: string;
}

export interface UpdatePurchaseItemRequest {
  quantity?: number;
  purchasePrice?: number;
  sellPrice?: number;
  expireDate?: string;
}

export interface CreatePurchaseReturnRequest {
  purchaseId?: number;
  note?: string;
  items: CreatePurchaseReturnItemRequest[];
  refundPayment?: RefundPaymentRequest;
}

export interface CreatePurchaseReturnItemRequest {
  purchaseItemId: number;
  batchId: number;
  quantity: number;
  unitPrice: number;
}

export interface RefundPaymentRequest {
  method: number;
  description?: string;
}
