import { useMutation } from '@tanstack/react-query';
import { api } from '../../api/apiClient';
import type { IStockFood } from '../../interfaces/IStockFood';


export function useStockFoodMutation() {
  return useMutation({
    mutationFn: async (updatedRow : IStockFood) => {
      const response = await api.put(`/stock_food/${updatedRow.id}`, updatedRow);
      return response.data;
    },
  });
}
