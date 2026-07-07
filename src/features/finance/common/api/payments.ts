import api from "../../../../core/api/client";
import type {
  PaymentDto,
  PaymentListResponse,
  CreatePaymentRequest,
  ReferencePaymentsResponse,
  PaymentsQueryParams,
} from "@/types";

export const getPayments = (params?: {
  page?: number;
  limit?: number;
  type?: number;
  method?: number;
  referenceType?: number;
  from?: string;
  to?: string;
}) => api.get<PaymentListResponse>("/payments", { params });

export const getPayment = (id: number) =>
  api.get<PaymentDto>(`/payments/${id}`);

export const createPayment = (data: CreatePaymentRequest) =>
  api.post<PaymentDto>("/payments", data);

export const getSalePayments = (saleId: number) =>
  api.get<ReferencePaymentsResponse>(`/payments/sale/${saleId}`);

export const getPurchasePayments = (purchaseId: number) =>
  api.get<ReferencePaymentsResponse>(`/payments/purchase/${purchaseId}`);

export const getSaleReturnPayments = (returnId: number) =>
  api.get<ReferencePaymentsResponse>(`/payments/sales-return/${returnId}`);

export const getPurchaseReturnPayments = (returnId: number) =>
  api.get<ReferencePaymentsResponse>(`/payments/purchase-return/${returnId}`);
