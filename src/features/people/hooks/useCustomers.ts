import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api/customers";

export function useCustomers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: async () => {
      const response = await getCustomers(params);
      return response.data;
    },
  });
}
