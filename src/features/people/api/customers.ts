import api from "../../../core/api/client";
import type {
  CustomerDto,
  CustomerListResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  SalesSummaryDto,
  CustomerSalesResponse,
  CustomerUnpaidSalesResponse,
  SalesStatementDto,
} from "@/types";

export const getCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<CustomerListResponse>("/customers", { params });

export const getCustomer = (id: number) =>
  api.get<CustomerDto>(`/customers/${id}`);

export const getDeletedCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<CustomerListResponse>("/customers/deleted", { params });

export const createCustomer = (data: CreateCustomerRequest) =>
  api.post<CustomerDto>("/customers", data);

export const updateCustomer = (id: number, data: UpdateCustomerRequest) =>
  api.put<CustomerDto>(`/customers/${id}`, data);

export const deleteCustomer = (id: number) => api.delete(`/customers/${id}`);

export const hardDeleteCustomer = (id: number) =>
  api.delete(`/customers/${id}/hard`);

export const restoreCustomer = (id: number) =>
  api.post(`/customers/${id}/restore`);

export const getCustomerSales = (
  id: number,
  params?: { page?: number; limit?: number; status?: number },
) => api.get<CustomerSalesResponse>(`/customers/${id}/sales`, { params });

export const getCustomerDebt = (id: number) =>
  api.get<SalesSummaryDto>(`/customers/${id}/debt`);

export const getCustomerUnpaidSales = (id: number) =>
  api.get<CustomerUnpaidSalesResponse>(`/customers/${id}/unpaid-sales`);

export const getCustomerStatement = (
  id: number,
  from?: string,
  to?: string,
) =>
  api.get<SalesStatementDto>(`/customers/${id}/statement`, {
    params: { from, to },
  });


