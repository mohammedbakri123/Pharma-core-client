import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierApi } from "../api/suppliers";
import type { CreateSupplierRequest, UpdateSupplierRequest } from "@/types";

export function useSuppliers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const response = await supplierApi.getSuppliers(params);
      return response.data;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => supplierApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSupplierRequest }) =>
      supplierApi.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
