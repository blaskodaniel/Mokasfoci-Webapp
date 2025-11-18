import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";
import type { Match } from "@/models/match.type";

// Query keys - központi helyen definiáljuk
export const matchesKeys = {
  all: ["matches"] as const,
  upcoming: () => [...matchesKeys.all, "upcoming"] as const,
  recent: () => [...matchesKeys.all, "recent"] as const,
  byTeam: (teamId: string) => [...matchesKeys.all, "team", teamId] as const,
};

// Upcoming matches hook
export const useUpcomingMatches = (limit?: number) => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.upcoming(),
    queryFn: () => Api.getUpcomingMatches({ limit }),
    staleTime: 5 * 60 * 1000, // 5 perc
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Recent matches hook
export const useRecentMatches = () => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.recent(),
    queryFn: () => Api.getRecentMatches(),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    retry: 2,
  });
};

// Team specific matches
export const useTeamMatches = (teamId: string) => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.byTeam(teamId),
    queryFn: () => Api.getTeamMatches(teamId),
    enabled: !!teamId, // Csak akkor fut le, ha van teamId
    staleTime: 5 * 60 * 1000,
  });
};
