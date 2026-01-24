import { useMutation, useQueryClient } from '@tanstack/react-query';
import { foodApi } from '../../api/foodApi';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

export function useFoodDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await foodApi.deleteFood(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('✓ Food item(s) deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    },
    onError: (error: AxiosError) => {
      const message = error?.response?.data || 'Failed to delete food item';
      toast.error(`✗ ${message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    },
  });
}

