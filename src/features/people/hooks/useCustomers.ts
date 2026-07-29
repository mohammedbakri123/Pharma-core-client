import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  hardDeleteCustomer,
  restoreCustomer,
  getCustomerSales,
  getCustomerDebt,
  getCustomerUnpaidSales,
  getCustomerStatement,
} from "../api/customers";
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/types";

export function useCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: async () => {
      const response = await getCustomers(params);
      return response.data;
    },
  });
}

export function useGetCustomer(id: number) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const response = await getCustomer(id);
      return response.data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerRequest }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useHardDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => hardDeleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useCustomerSales(
  id: number,
  params?: { page?: number; limit?: number; status?: number },
) {
  return useQuery({
    queryKey: ["customers", id, "sales", params],
    queryFn: async () => {
      const response = await getCustomerSales(id, params);
      return response.data;
    },
  });
}

export function useCustomerDebt(id: number) {
  return useQuery({
    queryKey: ["customers", id, "debt"],
    queryFn: async () => {
      const response = await getCustomerDebt(id);
      return response.data;
    },
  });
}

export function useCustomerUnpaidSales(id: number) {
  return useQuery({
    queryKey: ["customers", id, "unpaid-sales"],
    queryFn: async () => {
      const response = await getCustomerUnpaidSales(id);
      return response.data;
    },
  });
}

export function useCustomerStatement(id: number, from?: string, to?: string) {
  return useQuery({
    queryKey: ["customers", id, "statement", from, to],
    queryFn: async () => {
      const response = await getCustomerStatement(id, from, to);
      return response.data;
    },
  });
}


