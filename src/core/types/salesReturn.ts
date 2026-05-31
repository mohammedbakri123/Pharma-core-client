export interface SalesReturnItemDto {
  salesReturnItemId: number;
  salesReturnId: number;
  saleItemId: number;
  batchId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesReturnDto {
  salesReturnId: number;
  saleId: number | null;
  customerId: number | null;
  customerName?: string;
  userId: number | null;
  userName?: string;
  totalAmount: number;
  note: string | null;
  createdAt: string;
}

export interface SalesReturnDetailsDto extends SalesReturnDto {
  items: SalesReturnItemDto[];
}

export interface SalesReturnListResponse {
  salesReturns: SalesReturnDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateSalesReturnRequest {
  saleId?: number;
  customerId?: number;
  note?: string;
}

export interface AddSalesReturnItemRequest {
  saleItemId: number;
  batchId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateSalesReturnItemRequest {
  quantity?: number;
}

export interface UpdateSalesReturnRequest {
  note?: string;
}
