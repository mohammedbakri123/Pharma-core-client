import api from "../../../core/api/client";
import type { PosCheckoutRequest, PosCheckoutResultDto } from "../types/pos";

const checkout = (data: PosCheckoutRequest) =>
  api.post<PosCheckoutResultDto>("/pos/checkout", data);

export const PosApi = { checkout };
