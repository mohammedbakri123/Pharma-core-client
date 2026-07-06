import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPurchaseReturns,
  getPurchaseReturnById,
  createPurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
  addPurchaseReturnItem,
  updatePurchaseReturnItem,
  deletePurchaseReturnItem,
  completePurchaseReturn,
  cancelPurchaseReturn,
  getPurchaseReturnBalance,
} from "../api/purchaseReturns";
import type {
  CreatePurchaseReturnRequest,
  UpdatePurchaseReturnRequest,
  AddPurchaseReturnItemRequest,
  UpdatePurchaseReturnItemRequest,
} from "@/types";

export function usePurchaseReturns(
  purchaseId: number,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["purchase", purchaseId, "returns", params],
    queryFn: async () => {
      const response = await getPurchaseReturns(purchaseId, params);
      return response.data;
    },
    enabled: !!purchaseId,
  });
}

export function usePurchaseReturnById(purchaseId: number, returnId: number) {
  return useQuery({
    queryKey: ["purchase", purchaseId, "returns", returnId],
    queryFn: async () => {
      const response = await getPurchaseReturnById(purchaseId, returnId);
      return response.data;
    },
    enabled: !!purchaseId && !!returnId,
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
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "balance"],
      });
    },
  });
}

export function useUpdatePurchaseReturn(purchaseId: number, returnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePurchaseReturnRequest) =>
      updatePurchaseReturn(purchaseId, returnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
    },
  });
}

export function useDeletePurchaseReturn(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: number) => deletePurchaseReturn(purchaseId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "balance"],
      });
    },
  });
}

export function useAddPurchaseReturnItem(purchaseId: number, returnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPurchaseReturnItemRequest) =>
      addPurchaseReturnItem(purchaseId, returnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns", returnId],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
    },
  });
}

export function useUpdatePurchaseReturnItem(
  purchaseId: number,
  returnId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdatePurchaseReturnItemRequest;
    }) => updatePurchaseReturnItem(purchaseId, returnId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns", returnId],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
    },
  });
}

export function useDeletePurchaseReturnItem(
  purchaseId: number,
  returnId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) =>
      deletePurchaseReturnItem(purchaseId, returnId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns", returnId],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
    },
  });
}

export function useCompletePurchaseReturn(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: number) =>
      completePurchaseReturn(purchaseId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "balance"],
      });
    },
  });
}

export function useCancelPurchaseReturn(purchaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: number) =>
      cancelPurchaseReturn(purchaseId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns"],
      });
    },
  });
}

export function usePurchaseReturnBalance(purchaseId: number, returnId: number) {
  return useQuery({
    queryKey: ["purchase", purchaseId, "returns", returnId, "balance"],
    queryFn: async () => {
      const response = await getPurchaseReturnBalance(purchaseId, returnId);
      return response.data;
    },
    enabled: !!purchaseId && !!returnId,
  });
}
