import api from "./client";
import type { SaleDetailsDto, SaleListResponse } from "@/types";

export const getInvoices = (params?: {
  page?: number;
  limit?: number;
  customerId?: number;
  status?: number;
  from?: string;
  to?: string;
}) => api.get<SaleListResponse>("/sales", { params });

export const getInvoice = (id: number) =>
  api.get<SaleDetailsDto>(`/sales/${id}`);
