import { useQuery } from "@tanstack/react-query";
import { foodApi } from "../api/foodApi";

export const useFoodStockQuery = () => {
  return useQuery({
    queryKey: ["stock-foods"],
    queryFn: foodApi.getStockFoods
  });
};