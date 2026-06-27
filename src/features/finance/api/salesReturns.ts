import api from "../../../core/api/client";
import type {
  SalesReturnDto,
  SalesReturnDetailsDto,
  SaleReturnsListResponse,
  CreateSalesReturnRequest,
  UpdateSalesReturnRequest,
  AddSalesReturnItemRequest,
  UpdateSalesReturnItemRequest,
  SalesReturnBalanceDto,
  CompleteSalesReturnResultDto,
} from "@/types";

export const createSaleReturn = (
  saleId: number,
  data: CreateSalesReturnRequest,
) => api.post<SalesReturnDto>(`/sales/${saleId}/returns`, data);

export const getSaleReturns = (
  saleId: number,
  params?: {
    page?: number;
    limit?: number;
  },
) => api.get<SaleReturnsListResponse>(`/sales/${saleId}/returns`, { params });

export const getSaleReturnById = (saleId: number, returnId: number) =>
  api.get<SalesReturnDetailsDto>(`/sales/${saleId}/returns/${returnId}`);

export const updateSaleReturn = (
  saleId: number,
  returnId: number,
  data: UpdateSalesReturnRequest,
) => api.put<SalesReturnDto>(`/sales/${saleId}/returns/${returnId}`, data);

export const deleteSaleReturn = (saleId: number, returnId: number) =>
  api.delete(`/sales/${saleId}/returns/${returnId}`);

export const addSaleReturnItem = (
  saleId: number,
  returnId: number,
  data: AddSalesReturnItemRequest,
) => api.post(`/sales/${saleId}/returns/${returnId}/items`, data);

export const updateSaleReturnItem = (
  saleId: number,
  returnId: number,
  itemId: number,
  data: UpdateSalesReturnItemRequest,
) => api.put(`/sales/${saleId}/returns/${returnId}/items/${itemId}`, data);

export const deleteSaleReturnItem = (
  saleId: number,
  returnId: number,
  itemId: number,
) => api.delete(`/sales/${saleId}/returns/${returnId}/items/${itemId}`);

export const completeSaleReturn = (saleId: number, returnId: number) =>
  api.post<CompleteSalesReturnResultDto>(`/sales/${saleId}/returns/${returnId}/complete`);

export const cancelSaleReturn = (saleId: number, returnId: number) =>
  api.post(`/sales/${saleId}/returns/${returnId}/cancel`);

export const getSaleReturnBalance = (saleId: number, returnId: number) =>
  api.get<SalesReturnBalanceDto>(`/sales/${saleId}/returns/${returnId}/balance`);
