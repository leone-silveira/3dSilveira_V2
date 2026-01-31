import { useQuery } from '@tanstack/react-query';
import { expenseApi } from '../api/expenseApi';

export const useExpenseQuery = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getExpenses();
      return response.data;
    },
  });
};

export const useExpensesByCategoryQuery = (category: string) => {
  return useQuery({
    queryKey: ['expenses', category],
    queryFn: async () => {
      const response = await expenseApi.getExpensesByCategory(category);
      return response.data;
    },
  });
};
