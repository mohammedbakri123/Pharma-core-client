export interface CustomerDto {
  customerId: number;
  name: string;
  phoneNumber: string | null;
  address: string | null;
  note: string | null;
  createdAt: string | null;
}

export interface CustomerListResponse {
  customers: CustomerDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
}

export interface SalesSummaryDto {
  customerId: number;
  totalSales: number;
  totalPaid: number;
  totalReturns: number;
  netBalance: number;
}

export interface SaleListItemDto {
  saleId: number;
  userId: number | null;
  userName: string | null;
  customerId: number | null;
  customerName: string | null;
  status: string;
  totalAmount: number;
  discount: number;
  createdAt: string | null;
  note: string | null;
}

export interface CustomerSalesResponse {
  customerId: number;
  sales: SaleListItemDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UnpaidSaleDto {
  saleId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string | null;
}

export interface CustomerUnpaidSalesResponse {
  customerId: number;
  unpaidSales: UnpaidSaleDto[];
}

export interface StatementEntryDto {
  date: string | null;
  type: string;
  referenceId: number;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface SalesStatementDto {
  customerId: number;
  entries: StatementEntryDto[];
  openingBalance: number;
  closingBalance: number;
}

export interface AppliedSalePayment {
  saleId: number;
  amountApplied: number;
  remainingBalance: number;
}

export interface CustomerBalanceSummary {
  totalDebt: number;
  newBalance: number;
}

export interface PayCustomerDebtResult {
  paymentId: number;
  amount: number;
  method: number;
  createdAt: string | null;
  appliedToSales: AppliedSalePayment[];
  customerBalance: CustomerBalanceSummary;
}
