import { PosApi } from "../api/pos";
import { useMutation } from "@tanstack/react-query";
import type { PosCheckoutRequest } from "../types/pos";

export function usePosCheckout() {
  return useMutation({
    mutationFn: (data: PosCheckoutRequest) =>
      PosApi.checkout(data).then((r) => r.data),
  });
}
