import api from "../../../core/api/client";
import type {
  PurchaseDto,
  PurchaseDetailsDto,
  PurchaseListResponse,
  PurchaseBalanceDto,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  AddPurchaseItemRequest,
  UpdatePurchaseItemRequest,
  PurchaseItemDto,
  PurchaseItemsResponse,
  PurchaseReturnDto,
  CreatePurchaseReturnRequest,
  CreatePurchasePaymentRequest,
} from "@/types";

export const getPurchases = (params?: {
  page?: number;
  limit?: number;
  supplierId?: number;
  status?: number;
  from?: string;
  to?: string;
}) => api.get<PurchaseListResponse>("/purchases", { params });

export const getPurchase = (id: number) =>
  api.get<PurchaseDetailsDto>(`/purchases/${id}`);

export const createPurchase = (data: CreatePurchaseRequest) =>
  api.post<PurchaseDto>("/purchases", data);

export const updatePurchase = (id: number, data: UpdatePurchaseRequest) =>
  api.put<PurchaseDto>(`/purchases/${id}`, data);

export const deletePurchase = (id: number) => api.delete(`/purchases/${id}`);

export const addPurchaseItem = (id: number, data: AddPurchaseItemRequest) =>
  api.post<PurchaseItemDto>(`/purchases/${id}/items`, data);

export const updatePurchaseItem = (
  id: number,
  itemId: number,
  data: UpdatePurchaseItemRequest,
) => api.put<PurchaseItemDto>(`/purchases/${id}/items/${itemId}`, data);

export const deletePurchaseItem = (id: number, itemId: number) =>
  api.delete(`/purchases/${id}/items/${itemId}`);

export const completePurchase = (id: number) =>
  api.post<PurchaseDto>(`/purchases/${id}/complete`);

export const cancelPurchase = (id: number) =>
  api.post(`/purchases/${id}/cancel`);

export const getPurchaseBalance = (id: number) =>
  api.get<PurchaseBalanceDto>(`/purchases/${id}/balance`);

export const getPurchaseItems = (id: number) =>
  api.get<PurchaseItemsResponse>(
    `/purchases/${id}/items`,
  );

export const getPurchaseReturns = (id: number) =>
  api.get(`/purchases/${id}/returns`);

export const createPurchaseReturn = (id: number, data: CreatePurchaseReturnRequest) =>
  api.post<PurchaseReturnDto>(`/purchases/${id}/return`, data);

export const payPurchase = (id: number, data: CreatePurchasePaymentRequest) =>
  api.post(`/purchases/${id}/pay`, data);
