import api from "./client";
import type {
  CustomerDto,
  CustomerListResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  SalesSummaryDto,
} from "@/types";

export const getCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<CustomerListResponse>("/customers", { params });

export const getCustomer = (id: number) =>
  api.get<CustomerDto>(`/customers/${id}`);

export const createCustomer = (data: CreateCustomerRequest) =>
  api.post<CustomerDto>("/customers", data);

export const updateCustomer = (id: number, data: UpdateCustomerRequest) =>
  api.put<CustomerDto>(`/customers/${id}`, data);

export const deleteCustomer = (id: number) =>
  api.delete(`/customers/${id}`);

export const restoreCustomer = (id: number) =>
  api.post(`/customers/${id}/restore`);

export const getCustomerSales = (
  id: number,
  params?: { page?: number; limit?: number; status?: number }
) => api.get(`/customers/${id}/sales`, { params });

export const getCustomerDebt = (id: number) =>
  api.get<SalesSummaryDto>(`/customers/${id}/debt`);

export const getCustomerUnpaidSales = (id: number) =>
  api.get(`/customers/${id}/unpaid-sales`);

export const getCustomerStatement = (
  id: number,
  from?: string,
  to?: string
) => api.get(`/customers/${id}/statement`, { params: { from, to } });

export const payCustomerDebt = (
  id: number,
  data: { amount: number; method: number; description?: string }
) => api.post(`/customers/${id}/pay`, data);
