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
  // Collection routes need trailing slash
  getExpenses: async () => {
    return api.get<Expense[]>('/expenses/');
  },

  createExpense: async (data: ExpenseCreate) => {
    return api.post<Expense>('/expenses/', data);
  },

  getExpensesByCategory: async (category: string) => {
    return api.get<Expense[]>(`/expenses/category/${category}`);
  },

  // Item routes — no trailing slash
  getExpense: async (id: number) => {
    return api.get<Expense>(`/expenses/${id}`);
  },

  updateExpense: async (id: number, data: Partial<ExpenseCreate>) => {
    return api.put<Expense>(`/expenses/${id}`, data);
  },

  deleteExpense: async (id: number) => {
    return api.delete(`/expenses/${id}`);
  },
};
