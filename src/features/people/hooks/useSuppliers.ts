import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/suppliers";

export function useSuppliers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const response = await getSuppliers(params);
      return response.data;
    },
  });
}
