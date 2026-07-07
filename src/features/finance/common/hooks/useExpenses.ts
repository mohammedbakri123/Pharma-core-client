import { ExpenseApi } from "../api/expenses";
import { CreateExpenseRequest, UpdateExpenseRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpenseList(params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: ["expenses-list", params],
    queryFn: async () => {
      const response = await ExpenseApi.getExpenses(params);
      return response.data;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) =>
      ExpenseApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-list"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExpenseRequest }) =>
      ExpenseApi.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-list"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ExpenseApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-list"] });
    },
  });
}
