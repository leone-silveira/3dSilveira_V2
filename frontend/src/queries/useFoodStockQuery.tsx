import { useQuery } from '@tanstack/react-query';
import { foodApi } from '../api/foodApi';
import { toast } from 'react-toastify';
import axios from 'axios';

export const useFoodStockQuery = () => {
  return useQuery({
    queryKey: ['stock-foods'],
    queryFn: async () => {
      try {
        return await foodApi.getStockFoods();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error('Unauthorized access');
          }
        } else {
          toast.error('An unexpected error occurred');
        }
        throw error;
      }
    },
  });
};
