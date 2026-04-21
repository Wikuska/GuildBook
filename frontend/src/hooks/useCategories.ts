import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/lookup";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 10,
    queryFn: fetchCategories,
  });
