import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";
import type { Match, MatchDetail } from "@/models/match.type";
import { MatchStatus } from "@/utils/enums";

const matchRefreshInterval = 60 * 1000; // 1 perc

// Query keys - központi helyen definiáljuk
export const matchesKeys = {
  all: ["matches"] as const,
  upcoming: () => [...matchesKeys.all, "upcoming"] as const,
  recent: () => [...matchesKeys.all, "recent"] as const,
  getDetails: (matchId: string) => [...matchesKeys.all, "details", matchId] as const,
  getLive: () => [...matchesKeys.all, "live"] as const,
};

export const useAllMatches = ({
  sortBy,
  sortOrder,
  startDate,
  endDate,
}: {
  sortBy?: string;
  sortOrder?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return useQuery<Match[]>({
    queryKey: [
      ...matchesKeys.all,
      { sortBy, sortOrder, startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
    ],
    queryFn: () => Api.getAllMatches({ sortBy, sortOrder, startDate, endDate }),
    staleTime: matchRefreshInterval,
    retry: 2,
    refetchInterval: matchRefreshInterval,
    refetchIntervalInBackground: false,
  });
};

// Upcoming matches hook
export const useUpcomingMatches = (limit?: number) => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.upcoming(),
    queryFn: () => Api.getUpcomingMatches({ limit }),
    staleTime: matchRefreshInterval,
    retry: 2,
    refetchInterval: matchRefreshInterval,
    refetchIntervalInBackground: false,
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

// Live matches
export const useLiveMatches = () => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.getLive(),
    queryFn: () => Api.getLiveMatches(),
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

export const isBettableMatch = (match: Match): boolean => {
  const isEnabledMatch = match.status === MatchStatus.enabled;
  const isExistTeams = match.teamA !== undefined && match.teamB !== undefined;
  const isOddsAvailable =
    match.oddsAwin !== undefined && match.oddsBwin !== undefined && match.oddsDraw !== undefined;
  return isEnabledMatch && isExistTeams && isOddsAvailable;
};
