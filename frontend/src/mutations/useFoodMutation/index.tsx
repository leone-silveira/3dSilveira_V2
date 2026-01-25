import { useMutation, useQueryClient } from '@tanstack/react-query';
import { foodApi } from '../../api/foodApi';
import type { IFood } from '../../interfaces/IFoods';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

export function useFoodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFood: Omit<IFood, 'id'>) => {
      return await foodApi.createFood(newFood);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success(`✓ Food item "${data.name}" added successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    },
    onError: (error: AxiosError) => {
      const message = error?.response?.data || 'Failed to add food item';
      toast.error(`✗ ${message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    },
  });
}

