import type { IStockFood } from '../interfaces/stockFood';
import { api } from './apiClient';

export const foodApi = {
  getStockFoods: async (): Promise<IStockFood[]> => {
    const response = await api.get('/stock_food');
    return response.data;
  },

  getStockFoodById: async (id: number): Promise<IStockFood> => {
    const response = await api.get(`/stock_food/${id}`);
    return response.data;
  },
};
