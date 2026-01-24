import type { Team } from "@/models/team.type";
import Api from "@/services/service";
import type { GetTeamRankingsResponse } from "@/services/types";
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

export const useGetGroupsStandings = () => {
  return useQuery<GetTeamRankingsResponse>({
    queryKey: [...teamsKeys.all, "standings"],
    queryFn: () => Api.getGroupsStandings(),
    staleTime: 30 * 60 * 1000, // 30 perc
    retry: 2,
  });
};

export const useGetGroupStandingsById = (groupId: string) => {
  return useQuery<Team[]>({
    queryKey: [...teamsKeys.all, "standings", groupId],
    queryFn: () => Api.getGroupStandingsById(groupId),
    staleTime: 30 * 60 * 1000, // 30 perc
    enabled: !!groupId,
    retry: 2,
  });
};
