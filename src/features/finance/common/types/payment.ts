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
  SalesReturn = "sales_Return",
  PurchaseReturn = "purchase_Return",
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

export interface PaymentOverviewMethodSummary {
  in: number;
  out: number;
  net: number;
}

export interface PaymentOverviewReferenceSummary {
  sale: number;
  purchase: number;
  expense: number;
  salesReturn: number;
  purchaseReturn: number;
}

export interface PaymentOverviewSummary {
  totalIn: number;
  totalOut: number;
  net: number;
  cash: PaymentOverviewMethodSummary;
  card: PaymentOverviewMethodSummary;
  byReferenceType: PaymentOverviewReferenceSummary;
}

export interface PaymentOverviewItem extends PaymentDto {
  parentReferenceId: number | null;
  referenceLabel: string;
  partyName: string | null;
  referenceTotal: number | null;
}

export interface PaymentOverviewResponse {
  summary: PaymentOverviewSummary;
  payments: PaymentOverviewItem[];
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
export type CreatePaymentInput = Omit<
  CreatePaymentRequest,
  "referenceType" | "referenceId"
>;

export interface PaymentsQueryParams {
  page?: number;
  limit?: number;
  type?: PaymentType;
  method?: PaymentMethod;
  referenceType?: PaymentReferenceType;
  from?: string;
  to?: string;
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
