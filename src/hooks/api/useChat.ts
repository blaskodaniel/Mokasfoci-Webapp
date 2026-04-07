import type { ChatMessage } from "@/models/chat.type";
import Api from "@/services/service";
import { useQuery } from "@tanstack/react-query";

export const useChatMessages = (room: string) => {
  return useQuery<ChatMessage[]>({
    queryKey: ["chat", room],
    queryFn: () => Api.getChatMessages(room),
    staleTime: Infinity,
    retry: 2,
  });
};
