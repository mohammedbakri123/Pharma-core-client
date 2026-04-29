import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api";
import type {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

export function useCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesApi.getCategories(params),
  });
}

export function useDeletedCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["deletedCategories", params],
    queryFn: () => categoriesApi.getDeletedCategories(params),
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["deletedCategories"] });
    },
  });
}

export function useHardDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.hardDeleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedCategories"] });
    },
  });
}
