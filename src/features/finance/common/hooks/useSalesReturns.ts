import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSaleReturns,
  getSaleReturnById,
  createSaleReturn,
  deleteSaleReturn,
  addSaleReturnItem,
  updateSaleReturnItem,
  deleteSaleReturnItem,
  completeSaleReturn,
  cancelSaleReturn,
  getSaleReturnBalance,
} from "../api/salesReturns";
import type {
  CreateSalesReturnRequest,
  AddSalesReturnItemRequest,
  UpdateSalesReturnItemRequest,
} from "@/types";

export function useSaleReturns(saleId: number) {
  return useQuery({
    queryKey: ["sale", saleId, "returns"],
    queryFn: async () => {
      const response = await getSaleReturns(saleId);
      return response.data;
    },
    enabled: !!saleId,
  });
}

export function useSaleReturnById(saleId: number, returnId: number) {
  return useQuery({
    queryKey: ["sale", saleId, "returns", returnId],
    queryFn: async () => {
      const response = await getSaleReturnById(saleId, returnId);
      return response.data;
    },
    enabled: !!saleId && !!returnId,
  });
}

export function useCreateSaleReturn(saleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSalesReturnRequest) =>
      createSaleReturn(saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
    },
  });
}

export function useDeleteSaleReturn(saleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (returnId: number) => deleteSaleReturn(saleId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}

export function useAddSaleReturnItem(saleId: number, returnId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSalesReturnItemRequest) =>
      addSaleReturnItem(saleId, returnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}

export function useUpdateSaleReturnItem(saleId: number, returnId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdateSalesReturnItemRequest;
    }) => updateSaleReturnItem(saleId, returnId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}

export function useCompleteSaleReturn(saleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (returnId: number) => completeSaleReturn(saleId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}

export function useCancelSaleReturn(saleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (returnId: number) => cancelSaleReturn(saleId, returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
    },
  });
}

export function useGetSaleReturnBalance(saleId: number, returnId: number) {
  return useQuery({
    queryKey: ["sale", saleId, "returns", returnId, "balance"],
    queryFn: async () => {
      const response = await getSaleReturnBalance(saleId, returnId);
      return response.data;
    },
    enabled: !!saleId && !!returnId,
  });
}

export function useDeleteSaleReturnItem(saleId: number, returnId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) =>
      deleteSaleReturnItem(saleId, returnId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId, "returns"] });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}
