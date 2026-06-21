import { useQuery } from "@tanstack/react-query";
import { getSales } from "../api/sales";

export function useSales(params?: { page?: number; limit?: number; status?: number }) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const response = await getSales(params);
      return response.data;
    },
  });
}
