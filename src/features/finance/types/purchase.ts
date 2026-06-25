export enum PurchaseStatus {
  Draft = "draft",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface PurchaseItemDto {
  purchaseItemId: number;
  medicineId: number;
  medicineName?: string;
  batchId: number | null;
  batchNumber?: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  totalPrice: number;
  expireDate: string | null;
}

export interface PurchaseItemDetailsDto {
  purchaseItemId: number;
  medicineId: number;
  medicineName?: string;
  batchId: number | null;
  batchNumber?: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  totalPrice: number;
  expireDate: string | null;
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

export interface PurchaseDetailsDto {
  purchaseId: number;
  supplierId: number | null;
  supplierName?: string;
  invoiceNumber: string | null;
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: string;
  note: string | null;
  items: PurchaseItemDetailsDto[];
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

export interface CompletePurchaseResultDto {
  purchaseId: number;
  status: PurchaseStatus;
  totalAmount: number;
  completedAt: string;
  stockMovementsCreated: number;
  paymentId: number;
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
  batchNumber: string;
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

export interface PurchaseItemsResponse {
  purchaseId: number;
  items: PurchaseItemDto[];
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

export interface PurchaseReturnItemDto {
  purchaseReturnItemId: number;
  purchaseItemId: number;
  batchId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseReturnDto {
  purchaseReturnId: number;
  purchaseId: number | null;
  supplierId: number | null;
  userId: number | null;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  items: PurchaseReturnItemDto[];
  refundPaymentId: number | null;
}

export interface CreatePurchasePaymentRequest {
  method: number;
  amount: number;
  description?: string;
}
