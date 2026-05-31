export interface ExpenseDto {
  expenseId: number;
  userId: number | null;
  userName?: string;
  amount: number;
  description: string | null;
  createdAt: string | null;
}

export interface ExpenseListResponse {
  expenses: ExpenseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateExpenseRequest {
  amount: number;
  description?: string;
}
