import api from "./client";
import type {
  ExpenseDto,
  ExpenseListResponse,
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

export const deleteExpense = (id: number) =>
  api.delete(`/expenses/${id}`);
