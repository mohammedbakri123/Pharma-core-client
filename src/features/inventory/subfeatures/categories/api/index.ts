import api from "@/api/client";
import type {
  CategoryDto,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

const categoriesApi = {
  getCategories: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get<CategoryListResponse>("/categories", { params }),

  getCategory: (id: number) =>
    api.get<CategoryDto>(`/categories/${id}`),

  createCategory: (data: CreateCategoryRequest) =>
    api.post<CategoryDto>("/categories", data),

  updateCategory: (id: number, data: UpdateCategoryRequest) =>
    api.put<CategoryDto>(`/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete(`/categories/${id}`),

  hardDeleteCategory: (id: number) =>
    api.delete(`/categories/${id}/hard`),

  getDeletedCategories: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get<CategoryListResponse>("/categories/deleted", { params }),

  restoreCategory: (id: number) =>
    api.post(`/categories/${id}/restore`),
};

export { categoriesApi };
export default categoriesApi;
