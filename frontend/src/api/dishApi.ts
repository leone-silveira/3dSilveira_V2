import type { IDish, IDishCreate, IMealPlanEntry } from '../interfaces/IDish';
import { api } from './apiClient';

export const dishApi = {
  getDishes: async (): Promise<IDish[]> => {
    const res = await api.get('/dishes/');
    return res.data;
  },

  createDish: async (data: IDishCreate): Promise<IDish> => {
    const res = await api.post('/dishes/', data);
    return res.data;
  },

  updateDish: async (id: number, data: IDishCreate): Promise<IDish> => {
    const res = await api.put(`/dishes/${id}`, data);
    return res.data;
  },

  deleteDish: async (id: number): Promise<void> => {
    await api.delete(`/dishes/${id}`);
  },

  getMealPlanEntries: async (date: string): Promise<IMealPlanEntry[]> => {
    const res = await api.get('/meal_plans/', { params: { date } });
    return res.data;
  },

  addMealPlanEntry: async (data: {
    date: string;
    meal_type: string;
    dish_id: number;
    servings: number;
  }): Promise<IMealPlanEntry> => {
    const res = await api.post('/meal_plans/', data);
    return res.data;
  },

  removeMealPlanEntry: async (id: number): Promise<void> => {
    await api.delete(`/meal_plans/${id}`);
  },
};
