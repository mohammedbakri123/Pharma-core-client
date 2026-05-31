import { MedicineUnit } from "./medicine";
import { PaymentMethod } from "./payment";

export enum SaleStatus {
  Draft = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface SaleItemDto {
  saleItemId: number;
  saleId: number;
  medicineId: number;
  batchId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleDto {
  saleId: number;
  userId: number | null;
  customerId: number | null;
  status: SaleStatus;
  totalAmount: number;
  discount: number;
  createdAt: string;
  note: string | null;
}

export interface SaleDetailsDto extends SaleDto {
  items: SaleItemDto[];
  customerName?: string;
  userName?: string;
}

export interface SaleListResponse {
  sales: SaleDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface SaleBalanceDto {
  saleId: number;
  totalAmount: number;
  totalPaid: number;
  balance: number;
}

export interface CompleteSaleResultDto {
  saleId: number;
  totalAmount: number;
  totalPaid: number;
  change: number;
  status: SaleStatus;
}

export interface CreateSaleRequest {
  customerId?: number;
  note?: string;
  discount?: number;
}

export interface AddSaleItemRequest {
  medicineId: number;
  quantity: number;
  unitPrice?: number;
}

export interface UpdateSaleItemRequest {
  quantity: number;
}

export interface SalePaymentRequest {
  amount: number;
  method: PaymentMethod;
  description?: string;
}

export interface CompleteSaleRequest {
  payments: SalePaymentRequest[];
}
