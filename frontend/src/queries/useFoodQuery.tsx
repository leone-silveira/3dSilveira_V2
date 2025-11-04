import { useQuery } from "@tanstack/react-query";
import { foodApi } from "../api/foodApi";

export const useFoodQuery = () => {
  return useQuery({
    queryKey: ["foods"],
    queryFn: foodApi.getFoods
  });
};