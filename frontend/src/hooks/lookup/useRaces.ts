import { useQuery } from "@tanstack/react-query";
import { fetchRaces } from "../../api/lookup";

export const useRaces = () =>
  useQuery({
    queryKey: ["races"],
    staleTime: Infinity,
    queryFn: fetchRaces,
  });
