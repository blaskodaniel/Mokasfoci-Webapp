import type { Team } from "@/models/team.type";
import Api from "@/services/service";
import { useQuery } from "@tanstack/react-query";

export const teamsKeys = {
  all: ["teams"] as const,
};

export const useAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: teamsKeys.all,
    queryFn: () => Api.getTeams(),
    staleTime: 30 * 60 * 1000, // 30 perc
    retry: 2,
  });
};
