import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPayments,
  getSalePayments,
  getSaleReturnPayments,
} from "../api/payments";
import {
  CreatePaymentRequest,
  CreateSalePaymentRequest,
  PaymentReferenceType,
  PaymentsQueryParams,
} from "../types/payment";

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

export function useSalePayments(
  saleId: number,
  params?: PaymentsQueryParams,
) {
  return useQuery({
    queryKey: ["sale", saleId, "payments", params],
    queryFn: async () => {
      const response = await getSalePayments(saleId, params);
      return response.data;
    },
    enabled: !!saleId,
  });
}
export function useAddSalePayment(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalePaymentRequest) =>
      createPayment({
        ...data,
        referenceType: PaymentReferenceType.Sale,
        referenceId: saleId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
}

export function useSaleReturnPayments(
  returnId: number,
  params?: PaymentsQueryParams,
) {
  return useQuery({
    queryKey: ["sale", "return", returnId, "payments", params],
    queryFn: async () => {
      const response = await getSaleReturnPayments(returnId, params);
      return response.data;
    },
    enabled: !!returnId,
  });
}

export function useAddSaleReturnPayment(saleId: number, returnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalePaymentRequest) =>
      createPayment({
        ...data,
        referenceType: PaymentReferenceType.SalesReturn,
        referenceId: returnId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sale", "return", returnId, "payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "returns", returnId, "balance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sale", saleId, "balance"],
      });
    },
  });
}
