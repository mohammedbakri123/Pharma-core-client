import api from "@/api/client";
import type {
  CategoryDto,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

export const getCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<CategoryListResponse>("/categories", { params });

export const getCategory = (id: number) =>
  api.get<CategoryDto>(`/categories/${id}`);

export const createCategory = (data: CreateCategoryRequest) =>
  api.post<CategoryDto>("/categories", data);

export const updateCategory = (id: number, data: UpdateCategoryRequest) =>
  api.put<CategoryDto>(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`);

export const hardDeleteCategory = (id: number) =>
  api.delete(`/categories/${id}/hard`);

export const getDeletedCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => api.get<CategoryListResponse>("/categories/deleted", { params });

export const restoreCategory = (id: number) =>
  api.post(`/categories/${id}/restore`);
