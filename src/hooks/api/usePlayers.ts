import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";
import type { User } from "@/models/user.type";

// Players query keys
export const playersKeys = {
  all: ["players"] as const,
  topScorers: () => [...playersKeys.all, "top-scorers"] as const,
  byTeam: (teamId: string) => [...playersKeys.all, "team", teamId] as const,
  statistics: (playerId: string) =>
    [...playersKeys.all, playerId, "stats"] as const,
};

// Top scorers hook
export const useTopScorers = (limit = 10) => {
  return useQuery<User[]>({
    queryKey: [...playersKeys.topScorers(), limit],
    queryFn: () => Api.getTopScorers(limit),
    staleTime: 15 * 60 * 1000, // 15 perc (ritkábban változik)
    retry: 2,
  });
};

// Player statistics
export const usePlayerStats = (playerId: string) => {
  return useQuery<User>({
    queryKey: playersKeys.statistics(playerId),
    queryFn: () => Api.getPlayerStats(playerId),
    enabled: !!playerId,
    staleTime: 10 * 60 * 1000,
  });
};

// Players by team
export const useTeamPlayers = (teamId: string) => {
  return useQuery<User[]>({
    queryKey: playersKeys.byTeam(teamId),
    queryFn: () => Api.getTeamPlayers(teamId),
    enabled: !!teamId,
    staleTime: 10 * 60 * 1000,
  });
};
