import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/expenses";

export function useExpenses(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: async () => {
      const response = await getExpenses(params);
      return response.data;
    },
  });
}
