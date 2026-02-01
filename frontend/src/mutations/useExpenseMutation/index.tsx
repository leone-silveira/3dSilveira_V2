import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExpenseCreate } from '../../api/expenseApi';
import { expenseApi } from '../../api/expenseApi';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

export const useExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: ExpenseCreate) => {
      const response = await expenseApi.createExpense(expenseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(error.response?.data?.detail || 'Error creating expense');
    },
  });
};

export const useExpenseUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ExpenseCreate> }) => {
      const response = await expenseApi.updateExpense(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(error.response?.data?.detail || 'Error updating expense');
    },
  });
};

export const useExpenseDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await expenseApi.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(error.response?.data?.detail || 'Error deleting expense');
    },
  });
};
