import { useQuery } from "@tanstack/react-query";
import Api from "@/services/service";
import type { GroupDetailsResponse } from "@/services/types";

export const useGroupById = (groupId: string | undefined) => {
  return useQuery<GroupDetailsResponse>({
    queryKey: ["getGroupById", groupId],
    queryFn: () => Api.getGroupById(groupId!),
    staleTime: 2 * 60 * 1000, // 2 perc (gyakrabban frissül)
    enabled: !!groupId,
    retry: 2,
  });
};
