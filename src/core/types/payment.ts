export enum PaymentType {
  Incoming = 1,
  Outgoing = 2,
}

export enum PaymentMethod {
  Cash = 1,
  Card = 2,
}

export enum PaymentReferenceType {
  Sale = 1,
  Purchase = 2,
  Expense = 3,
  SalesReturn = 4,
  PurchaseReturn = 5,
}

export interface PaymentDto {
  paymentId: number;
  type: PaymentType;
  referenceType: PaymentReferenceType;
  referenceId: number;
  method: PaymentMethod | null;
  userId: number | null;
  userName?: string;
  amount: number;
  description: string | null;
  createdAt: string | null;
}

export interface PaymentListResponse {
  payments: PaymentDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreatePaymentRequest {
  type: PaymentType;
  referenceType: PaymentReferenceType;
  referenceId: number;
  method?: PaymentMethod;
  amount: number;
  description?: string;
}

export interface ReferencePaymentsResponse {
  saleId?: number;
  purchaseId?: number;
  payments: PaymentDto[];
  totalPaid: number;
}
