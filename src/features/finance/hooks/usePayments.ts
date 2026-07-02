import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../api/payments";

export function usePayments(params?: {
  page?: number;
  limit?: number;
  type?: number;
  method?: number;
  referenceType?: number;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const response = await getPayments(params);
      return response.data;
    },
  });
}
