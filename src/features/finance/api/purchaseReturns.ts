import api from "../../../core/api/client";
import type {
  PurchaseReturnDto,
  PurchaseReturnDetailsDto,
  PurchaseReturnsListResponse,
  PurchaseReturnBalanceDto,
  CompletePurchaseReturnResultDto,
  PurchaseReturnItemDto,
  CreatePurchaseReturnRequest,
  UpdatePurchaseReturnRequest,
  AddPurchaseReturnItemRequest,
  UpdatePurchaseReturnItemRequest,
} from "@/types";

export const createPurchaseReturn = (
  purchaseId: number,
  data: CreatePurchaseReturnRequest,
) => api.post<PurchaseReturnDto>(`/purchases/${purchaseId}/returns`, data);

export const getPurchaseReturns = (
  purchaseId: number,
  params?: {
    page?: number;
    limit?: number;
  },
) => api.get<PurchaseReturnsListResponse>(`/purchases/${purchaseId}/returns`, { params });

export const getPurchaseReturnById = (purchaseId: number, returnId: number) =>
  api.get<PurchaseReturnDetailsDto>(`/purchases/${purchaseId}/returns/${returnId}`);

export const updatePurchaseReturn = (
  purchaseId: number,
  returnId: number,
  data: UpdatePurchaseReturnRequest,
) => api.put<PurchaseReturnDto>(`/purchases/${purchaseId}/returns/${returnId}`, data);

export const deletePurchaseReturn = (purchaseId: number, returnId: number) =>
  api.delete(`/purchases/${purchaseId}/returns/${returnId}`);

export const addPurchaseReturnItem = (
  purchaseId: number,
  returnId: number,
  data: AddPurchaseReturnItemRequest,
) => api.post<PurchaseReturnItemDto>(`/purchases/${purchaseId}/returns/${returnId}/items`, data);

export const updatePurchaseReturnItem = (
  purchaseId: number,
  returnId: number,
  itemId: number,
  data: UpdatePurchaseReturnItemRequest,
) => api.put<PurchaseReturnItemDto>(`/purchases/${purchaseId}/returns/${returnId}/items/${itemId}`, data);

export const deletePurchaseReturnItem = (
  purchaseId: number,
  returnId: number,
  itemId: number,
) => api.delete(`/purchases/${purchaseId}/returns/${returnId}/items/${itemId}`);

export const completePurchaseReturn = (purchaseId: number, returnId: number) =>
  api.post<CompletePurchaseReturnResultDto>(`/purchases/${purchaseId}/returns/${returnId}/complete`);

export const cancelPurchaseReturn = (purchaseId: number, returnId: number) =>
  api.post(`/purchases/${purchaseId}/returns/${returnId}/cancel`);

export const getPurchaseReturnBalance = (purchaseId: number, returnId: number) =>
  api.get<PurchaseReturnBalanceDto>(`/purchases/${purchaseId}/returns/${returnId}/balance`);
