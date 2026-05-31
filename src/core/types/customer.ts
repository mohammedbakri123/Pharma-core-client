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
  totalSales: number;
  totalPaid: number;
  totalReturns: number;
  balance: number;
}
