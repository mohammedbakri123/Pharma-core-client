import api from "../../../core/api/client";
import type {
  SaleDto,
  SaleDetailsDto,
  SaleListResponse,
  SaleBalanceDto,
  CreateSaleRequest,
  AddSaleItemRequest,
  UpdateSaleItemRequest,
  SalePaymentRequest,
  CompleteSaleRequest,
  CompleteSaleResultDto,
  SalesReturnDto,
  SalesReturnDetailsDto,
  SaleReturnsListResponse,
  CreateSalesReturnRequest,
  UpdateSalesReturnRequest,
  AddSalesReturnItemRequest,
  UpdateSalesReturnItemRequest,
} from "@/types";

export const getSales = (params?: {
  page?: number;
  limit?: number;
  customerId?: number;
  userId?: number;
  status?: number;
  from?: string;
  to?: string;
}) => api.get<SaleListResponse>("/sales", { params });

export const getSale = (id: number) => api.get<SaleDetailsDto>(`/sales/${id}`);

export const createSale = (data: CreateSaleRequest) =>
  api.post<SaleDto>("/sales", data);

export const addSaleItem = (saleId: number, data: AddSaleItemRequest) =>
  api.post(`/sales/${saleId}/items`, data);

export const updateSaleItem = (
  saleId: number,
  itemId: number,
  data: UpdateSaleItemRequest,
) => api.put(`/sales/${saleId}/items/${itemId}`, data);

export const deleteSaleItem = (saleId: number, itemId: number) =>
  api.delete(`/sales/${saleId}/items/${itemId}`);

export const completeSale = (saleId: number, data: CompleteSaleRequest) =>
  api.post<CompleteSaleResultDto>(`/sales/${saleId}/complete`, data);

export const cancelSale = (saleId: number) =>
  api.post(`/sales/${saleId}/cancel`);

export const getSaleBalance = (saleId: number) =>
  api.get<SaleBalanceDto>(`/sales/${saleId}/balance`);

export const createSaleReturn = (saleId: number, data: CreateSalesReturnRequest) =>
  api.post<SalesReturnDto>(`/sales/${saleId}/return`, data);

export const getSaleReturns = (saleId: number, params?: {
  page?: number;
  limit?: number;
}) => api.get<SaleReturnsListResponse>(
  `/sales/${saleId}/returns`,
  { params },
);

export const getSaleReturnById = (saleId: number, returnId: number) =>
  api.get<SalesReturnDetailsDto>(`/sales/${saleId}/returns/${returnId}`);

export const updateSaleReturn = (saleId: number, returnId: number, data: UpdateSalesReturnRequest) =>
  api.put<SalesReturnDto>(`/sales/${saleId}/returns/${returnId}`, data);

export const deleteSaleReturn = (saleId: number, returnId: number) =>
  api.delete(`/sales/${saleId}/returns/${returnId}`);

export const addSaleReturnItem = (saleId: number, returnId: number, data: AddSalesReturnItemRequest) =>
  api.post(`/sales/${saleId}/returns/${returnId}/items`, data);

export const updateSaleReturnItem = (saleId: number, returnId: number, itemId: number, data: UpdateSalesReturnItemRequest) =>
  api.put(`/sales/${saleId}/returns/${returnId}/items/${itemId}`, data);

export const deleteSaleReturnItem = (saleId: number, returnId: number, itemId: number) =>
  api.delete(`/sales/${saleId}/returns/${returnId}/items/${itemId}`);
