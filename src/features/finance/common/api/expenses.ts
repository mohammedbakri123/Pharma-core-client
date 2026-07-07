import api from "../../../../core/api/client";
import type {
  ExpenseDto,
  ExpenseListResponse,
  ExpenseDeletedListResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "@/types";

const getExpenses = (params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}) => api.get<ExpenseListResponse>("/expenses", { params });

const createExpense = (data: CreateExpenseRequest) =>
  api.post<ExpenseDto>("/expenses", data);

const updateExpense = (id: number, data: UpdateExpenseRequest) =>
  api.put<ExpenseDto>(`/expenses/${id}`, data);

const deleteExpense = (id: number) => api.delete(`/expenses/${id}`);

const restoreExpense = (id: number) =>
  api.post(`/expenses/${id}/restore`);

const getDeletedExpenses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
}) => api.get<ExpenseDeletedListResponse>(
  "/expenses/deleted",
  { params },
);

export const ExpenseApi = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  restoreExpense,
  getDeletedExpenses,
};
