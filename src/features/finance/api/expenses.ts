import api from "../../../core/api/client";
import type {
  ExpenseDto,
  ExpenseListResponse,
  ExpenseDeletedListResponse,
  CreateExpenseRequest,
} from "@/types";

export const getExpenses = (params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}) => api.get<ExpenseListResponse>("/expenses", { params });

export const createExpense = (data: CreateExpenseRequest) =>
  api.post<ExpenseDto>("/expenses", data);

export const deleteExpense = (id: number) => api.delete(`/expenses/${id}`);

export const restoreExpense = (id: number) =>
  api.post(`/expenses/${id}/restore`);

export const getDeletedExpenses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
}) => api.get<ExpenseDeletedListResponse>(
  "/expenses/deleted",
  { params },
);
