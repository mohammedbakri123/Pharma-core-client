import api from "./client";
import type {
  SupplierDto,
  SupplierListResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types";

export const getSuppliers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<SupplierListResponse>("/suppliers", { params });

export const getSupplier = (id: number) =>
  api.get<SupplierDto>(`/suppliers/${id}`);

export const createSupplier = (data: CreateSupplierRequest) =>
  api.post<SupplierDto>("/suppliers", data);

export const updateSupplier = (id: number, data: UpdateSupplierRequest) =>
  api.put<SupplierDto>(`/suppliers/${id}`, data);

export const deleteSupplier = (id: number) =>
  api.delete(`/suppliers/${id}`);
