import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../api/purchases";

export function usePurchases(params?: { page?: number; limit?: number; status?: number }) {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: async () => {
      const response = await getPurchases(params);
      return response.data;
    },
  });
}
