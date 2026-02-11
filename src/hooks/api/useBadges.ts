import type { BadgesResponse } from "@/services/types";
import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";

export const useMyBadges = () => {
  return useQuery<BadgesResponse>({
    queryKey: ["myBadges"],
    queryFn: () => Api.getMyBadges(),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    retry: 2,
  });
};

export const useBadgesByUser = (userId: string | undefined) => {
  return useQuery<BadgesResponse>({
    queryKey: ["badgesByUser", userId],
    queryFn: () => Api.getBadgesByUser(userId!),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    enabled: !!userId,
    retry: 2,
  });
};
