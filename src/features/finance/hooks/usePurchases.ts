import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  cancelPurchase,
  addPurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem,
  completePurchase,
  getPurchaseBalance,
  getPurchaseItems,
  getPurchaseReturns,
  payPurchase,
  createPurchaseReturn,
} from "../api/purchases";
import { getPurchasePayments } from "../api/payments";
import type {
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  AddPurchaseItemRequest,
  UpdatePurchaseItemRequest,
  CreatePurchasePaymentRequest,
  CreatePurchaseReturnRequest,
} from "@/types";

export function usePurchases(params?: {
  page?: number;
  limit?: number;
  supplierId?: number;
  status?: number;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: async () => {
      const response = await getPurchases(params);
      return response.data;
    },
  });
}

export function useGetPurchase(id: number) {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: async () => {
      const response = await getPurchase(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetPurchaseBalance(id: number) {
  return useQuery({
    queryKey: ["purchase", id, "balance"],
    queryFn: async () => {
      const response = await getPurchaseBalance(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetPurchaseItems(id: number) {
  return useQuery({
    queryKey: ["purchase", id, "items"],
    queryFn: async () => {
      const response = await getPurchaseItems(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePurchasePayments(purchaseId: number) {
  return useQuery({
    queryKey: ["purchase", purchaseId, "payments"],
    queryFn: async () => {
      const response = await getPurchasePayments(purchaseId);
      return response.data;
    },
    enabled: !!purchaseId,
  });
}

export function usePurchaseReturns(purchaseId: number) {
  return useQuery({
    queryKey: ["purchase", purchaseId, "returns"],
    queryFn: async () => {
      const response = await getPurchaseReturns(purchaseId);
      return response.data;
    },
    enabled: !!purchaseId,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseRequest) => createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useUpdatePurchase(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePurchaseRequest) =>
      updatePurchase(purchaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: number) => deletePurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useCancelPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: number) => cancelPurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useAddPurchaseItem(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPurchaseItemRequest) =>
      addPurchaseItem(purchaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "items"] });
    },
  });
}

export function useUpdatePurchaseItem(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdatePurchaseItemRequest;
    }) => updatePurchaseItem(purchaseId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "items"] });
    },
  });
}

export function useDeletePurchaseItem(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deletePurchaseItem(purchaseId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "items"] });
    },
  });
}

export function useCompletePurchase(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completePurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "balance"] });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "items"] });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function usePayPurchase(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchasePaymentRequest) =>
      payPurchase(purchaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "balance"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
}

export function useCreatePurchaseReturn(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseReturnRequest) =>
      createPurchaseReturn(purchaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
      queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId, "balance"] });
    },
  });
}
