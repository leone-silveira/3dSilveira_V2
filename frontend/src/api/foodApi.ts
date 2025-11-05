import { api } from "./apiClient";

export const foodApi = {
  getFoods: async () => {
    const response = await api.get("/foods");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/food/${id}`);
    return response.data;
  },
};