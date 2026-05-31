import api from "./client";
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

export const getSale = (id: number) =>
  api.get<SaleDetailsDto>(`/sales/${id}`);

export const createSale = (data: CreateSaleRequest) =>
  api.post<SaleDto>("/sales", data);

export const addSaleItem = (saleId: number, data: AddSaleItemRequest) =>
  api.post(`/sales/${saleId}/items`, data);

export const updateSaleItem = (
  saleId: number,
  itemId: number,
  data: UpdateSaleItemRequest
) => api.put(`/sales/${saleId}/items/${itemId}`, data);

export const deleteSaleItem = (saleId: number, itemId: number) =>
  api.delete(`/sales/${saleId}/items/${itemId}`);

export const completeSale = (saleId: number, data: CompleteSaleRequest) =>
  api.post<CompleteSaleResultDto>(`/sales/${saleId}/complete`, data);

export const cancelSale = (saleId: number) =>
  api.post(`/sales/${saleId}/cancel`);

export const getSaleBalance = (saleId: number) =>
  api.get<SaleBalanceDto>(`/sales/${saleId}/balance`);
