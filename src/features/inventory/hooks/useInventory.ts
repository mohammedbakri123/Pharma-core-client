import { useQuery } from "@tanstack/react-query";
import inventoryApi from "../api/inventory";
import { GetStockAlertQuery } from "../types/inventory";

export function useLowStockAlerts(params: GetStockAlertQuery) {
  return useQuery({
    queryKey: ["low-stock-alerts", params],
    queryFn: async () => {
      const response = await inventoryApi.GetAlerts(params);
      return response.data;
    },
  });
}
