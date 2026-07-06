export enum PaymentType {
  Incoming = "incoming",
  Outgoing = "outgoing",
}

export enum PaymentMethod {
  Cash = "cash",
  Card = "card",
}

export const methodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: "نقداً",
  [PaymentMethod.Card]: "بطاقة",
};

export enum PaymentReferenceType {
  Sale = "sale",
  Purchase = "purchase",
  Expense = "expense",
  SalesReturn = "salesReturn",
  PurchaseReturn = "purchaseReturn",
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
  referenceType: PaymentReferenceType;
  referenceId: number;
  method?: PaymentMethod;
  amount: number;
  description?: string;
}
export type CreateSalePaymentRequest = Omit<
  CreatePaymentRequest,
  "referenceType" | "referenceId"
>;

export interface PaymentsQueryParams {
  page: number;
  limit: number;
}

export interface ReferencePaymentsResponse {
  saleId?: number;
  purchaseId?: number;
  payments: PaymentDto[];
  totalPaid: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
