import api from "./client";
import type {
  SalesReturnDto,
  SalesReturnDetailsDto,
  SalesReturnListResponse,
  CreateSalesReturnRequest,
  UpdateSalesReturnRequest,
  AddSalesReturnItemRequest,
  UpdateSalesReturnItemRequest,
} from "@/types";

export const getSalesReturns = (params?: {
  page?: number;
  limit?: number;
  saleId?: number;
  customerId?: number;
  userId?: number;
  from?: string;
  to?: string;
}) => api.get<SalesReturnListResponse>("/sales-returns", { params });

export const getSalesReturn = (id: number) =>
  api.get<SalesReturnDetailsDto>(`/sales-returns/${id}`);

export const createSalesReturn = (data: CreateSalesReturnRequest) =>
  api.post<SalesReturnDto>("/sales-returns", data);

export const updateSalesReturn = (id: number, data: UpdateSalesReturnRequest) =>
  api.put<SalesReturnDto>(`/sales-returns/${id}`, data);

export const deleteSalesReturn = (id: number) =>
  api.delete(`/sales-returns/${id}`);

export const addSalesReturnItem = (
  id: number,
  data: AddSalesReturnItemRequest
) =>
  api.post(`/sales-returns/${id}/items`, data);

export const updateSalesReturnItem = (
  id: number,
  itemId: number,
  data: UpdateSalesReturnItemRequest
) => api.put(`/sales-returns/${id}/items/${itemId}`, data);

export const deleteSalesReturnItem = (id: number, itemId: number) =>
  api.delete(`/sales-returns/${id}/items/${itemId}`);
