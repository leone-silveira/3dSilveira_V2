import type { IFood } from '../interfaces/IFoods';
import type { IStockFood } from '../interfaces/IStockFood';
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

  getFoods: async (): Promise<IFood[]> => {
    const response = await api.get('/foods');
    return response.data;
  },
};
