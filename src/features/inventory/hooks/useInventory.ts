import { useQuery } from "@tanstack/react-query";
import inventoryApi from "../api/inventory";
import type { GetStockAlertQuery } from "../types/inventory";

export function useStockAlerts(params: GetStockAlertQuery) {
  return useQuery({
    queryKey: ["low-stock-alerts", params],
    queryFn: async () => {
      const response = await inventoryApi.GetAlerts(params);
      return response.data;
    },
  });
}

export function useGetStockByMedicine(id: number) {
  return useQuery({
    queryKey: ["stock-by-medicine", id],
    queryFn: async () => {
      const response = await inventoryApi.GetStockByMedicine(id);
      return response.data;
    },
    enabled: !!id,
  });
}
