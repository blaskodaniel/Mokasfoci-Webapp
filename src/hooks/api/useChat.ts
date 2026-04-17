import Api from "@/services/service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useChatMessages = (room: string, limit: number = 100) => {
  return useInfiniteQuery({
    queryKey: ["chat", room],
    queryFn: ({ pageParam }) => Api.getChatMessages(room, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < limit) return undefined;
      return lastPage[0]?.createdAt.toString();
    },
    staleTime: Infinity,
    retry: 2,
  });
};
