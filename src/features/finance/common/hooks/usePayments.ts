import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPayments,
  getPaymentsOverview,
  getSalePayments,
  getSaleReturnPayments,
  getPurchaseReturnPayments,
} from "../api/payments";
import {
  CreatePaymentRequest,
  CreatePaymentInput,
  PaymentReferenceType,
  PaymentsQueryParams,
  PaymentType,
  PaymentMethod,
} from "../types/payment";

export function usePayments(params?: PaymentsQueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const response = await getPayments(params);
      return response.data;
    },
  });
}

export function usePaymentsOverview(params?: PaymentsQueryParams) {
  return useQuery({
    queryKey: ["payments", "overview", params],
    queryFn: async () => {
      const response = await getPaymentsOverview(params);
      return response.data;
    },
  });
}

export function useSalePayments(saleId: number) {
  return useQuery({
    queryKey: ["sale", saleId, "payments"],
    queryFn: async () => {
      const response = await getSalePayments(saleId);
      return response.data;
    },
    enabled: !!saleId,
  });
}
export function useAddSalePayment(saleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
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

export function useSaleReturnPayments(returnId: number) {
  return useQuery({
    queryKey: ["sale", "return", returnId, "payments"],
    queryFn: async () => {
      const response = await getSaleReturnPayments(returnId);
      return response.data;
    },
    enabled: !!returnId,
  });
}

export function useAddSaleReturnPayment(saleId: number, returnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
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

export function usePurchaseReturnPayments(returnId: number) {
  return useQuery({
    queryKey: ["purchase", "return", returnId, "payments"],
    queryFn: async () => {
      const response = await getPurchaseReturnPayments(returnId);
      return response.data;
    },
    enabled: !!returnId,
  });
}

export function useAddPurchaseReturnPayment(
  purchaseId: number,
  returnId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
      createPayment({
        ...data,
        referenceType: PaymentReferenceType.PurchaseReturn,
        referenceId: returnId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase", "return", returnId, "payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "returns", returnId, "balance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase", purchaseId, "balance"],
      });
    },
  });
}

export function useGetFilters(
  searchParams: URLSearchParams,
): PaymentsQueryParams {
  return {
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "10"),
    ...(searchParams.get("type")
      ? { type: searchParams.get("type") as PaymentType }
      : {}),
    ...(searchParams.get("method")
      ? { method: searchParams.get("method") as PaymentMethod }
      : {}),
    ...(searchParams.get("referenceType")
      ? {
          referenceType: searchParams.get(
            "referenceType",
          ) as PaymentReferenceType,
        }
      : {}),
    ...(searchParams.get("from") ? { from: searchParams.get("from")! } : {}),
    ...(searchParams.get("to") ? { to: searchParams.get("to")! } : {}),
  };
}
