import { api } from "./apiClient";


export interface Expense {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  is_recurring: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  description: string;
  amount: number;
  category: string;
  date: string;
  is_recurring?: boolean;
  notes?: string;
}

export const expenseApi = {
  // Get all expenses
  getExpenses: async () => {
    return api.get<Expense[]>('/expenses');
  },

  // Get single expense
  getExpense: async (id: number) => {
    return api.get<Expense>(`/expenses/${id}`);
  },

  // Create expense
  createExpense: async (data: ExpenseCreate) => {
    return api.post<Expense>('/expenses', data);
  },

  // Update expense
  updateExpense: async (id: number, data: Partial<ExpenseCreate>) => {
    return api.put<Expense>(`/expenses/${id}`, data);
  },

  // Delete expense
  deleteExpense: async (id: number) => {
    return api.delete(`/expenses/${id}`);
  },

  // Get expenses by category
  getExpensesByCategory: async (category: string) => {
    return api.get<Expense[]>(`/expenses/category/${category}`);
  },
};
