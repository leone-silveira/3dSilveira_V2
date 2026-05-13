import type { IFood } from '../interfaces/IFoods';
import type { IStockFood } from '../interfaces/IStockFood';
import { api } from './apiClient';

export const foodApi = {
  // Stock food — collection route needs trailing slash
  getStockFoods: async (): Promise<IStockFood[]> => {
    const response = await api.get('/stock_food/');
    return response.data;
  },

  getStockFoodById: async (id: number): Promise<IStockFood> => {
    const response = await api.get(`/stock_food/${id}`);
    return response.data;
  },

  updateStockFood: async (id: number, food: Partial<IStockFood>): Promise<IStockFood> => {
    const response = await api.put(`/stock_food/${id}`, food);
    return response.data;
  },

  createStockFood: async (food: Omit<IStockFood, 'id'>): Promise<IStockFood> => {
    const response = await api.post('/stock_food/', food);
    return response.data;
  },

  deleteStockFood: async (id: number): Promise<void> => {
    await api.delete(`/stock_food/${id}`);
  },

  // Foods — collection route needs trailing slash
  getFoods: async (): Promise<IFood[]> => {
    const response = await api.get('/foods/');
    return response.data;
  },

  createFood: async (food: Omit<IFood, 'id'>): Promise<IFood> => {
    const response = await api.post('/foods/', food);
    return response.data;
  },

  deleteFood: async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);
  },

  updateFood: async (id: number, food: Omit<IFood, 'id'>): Promise<IFood> => {
    const response = await api.put(`/foods/${id}`, food);
    return response.data;
  },
};
