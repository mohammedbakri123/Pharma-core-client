import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSales, createSale, cancelSale } from "../api/sales";
import type { CreateSaleRequest, GetSalesRequest } from "@/types";

export function useSales(params?: GetSalesRequest) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const response = await getSales(params);
      return response.data;
    },
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
