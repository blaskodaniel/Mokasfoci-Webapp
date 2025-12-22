import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";
import type { Match, MatchDetail } from "@/models/match.type";

// Query keys - központi helyen definiáljuk
export const matchesKeys = {
  all: ["matches"] as const,
  upcoming: () => [...matchesKeys.all, "upcoming"] as const,
  recent: () => [...matchesKeys.all, "recent"] as const,
  getDetails: (matchId: string) =>
    [...matchesKeys.all, "details", matchId] as const,
};

export const useAllMatches = () => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.all,
    queryFn: () => Api.getAllMatches(),
    staleTime: 1 * 60 * 1000, // 10 perc
    retry: 2,
    refetchOnWindowFocus: true,
  });
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
export const useRecentMatches = (limit?: number) => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.recent(),
    queryFn: () => Api.getRecentMatches({ limit }),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    retry: 2,
  });
};

// Match details hook
export const useMatchDetails = (matchId: string) => {
  return useQuery<MatchDetail>({
    queryKey: matchesKeys.getDetails(matchId),
    queryFn: () => Api.getMatchDetails(matchId),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    retry: 2,
  });
};
