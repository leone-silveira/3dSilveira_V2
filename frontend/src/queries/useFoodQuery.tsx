import { useQuery } from "@tanstack/react-query";
import { foodApi } from "../api/foodApi";

export const useFoodQuery = () => {
  return useQuery({
    queryKey: ["stock-foods"],
    queryFn: foodApi.getStockFoods
  });
};