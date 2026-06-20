import api from "../../../core/api/client";
import type {
  SupplierDto,
  SupplierListResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types";

const getSuppliers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<SupplierListResponse>("/suppliers", { params });

const getSupplier = (id: number) => api.get<SupplierDto>(`/suppliers/${id}`);

const createSupplier = (data: CreateSupplierRequest) =>
  api.post<SupplierDto>("/suppliers", data);

const updateSupplier = (id: number, data: UpdateSupplierRequest) =>
  api.put<SupplierDto>(`/suppliers/${id}`, data);

const deleteSupplier = (id: number) => api.delete(`/suppliers/${id}`);

export const supplierApi = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
