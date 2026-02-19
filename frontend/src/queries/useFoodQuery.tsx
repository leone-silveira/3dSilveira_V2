import { useQuery } from "@tanstack/react-query";
import { foodApi } from "../api/foodApi";
import axios from "axios";
import { toast } from "react-toastify";

export const useFoodQuery = () => {
  return useQuery({
    queryKey: ['food'],
    queryFn: async () => {
      try {
        return await foodApi.getFoods();
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