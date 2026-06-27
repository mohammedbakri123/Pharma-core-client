import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSales,
  getSale,
  createSale,
  cancelSale,
  addSaleItem,
  updateSaleItem,
  deleteSaleItem,
  completeSale,
  getSaleBalance,
} from "../api/sales";
import { getSalePayments, createPayment } from "../api/payments";
import type {
  CreateSaleRequest,
  GetSalesRequest,
  AddSaleItemRequest,
  UpdateSaleItemRequest,
  CompleteSaleRequest,
  CreatePaymentRequest,
} from "@/types";

export function useSales(params?: GetSalesRequest) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const response = await getSales(params);
      return response.data;
    },
  });
}

export function useGetSale(id: number) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      const response = await getSale(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetSaleBalance(id: number) {
  return useQuery({
    queryKey: ["sale", id, "balance"],
    queryFn: async () => {
      const response = await getSaleBalance(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSalePayments(saleId: number) {
  return useQuery({
    queryKey: ["sale", saleId, "payments"],
    queryFn: async () => {
      const response = await getSalePayments(saleId);
      return response.data;
    },
    enabled: !!saleId,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleRequest) => createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useCancelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: number) => cancelSale(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useAddSaleItem(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSaleItemRequest) => addSaleItem(saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
    },
  });
}

export function useUpdateSaleItem(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdateSaleItemRequest;
    }) => updateSaleItem(saleId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
    },
  });
}

export function useDeleteSaleItem(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deleteSaleItem(saleId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
    },
  });
}

export function useCompleteSale(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeSale(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "balance"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useAddSalePayment(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "balance"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
