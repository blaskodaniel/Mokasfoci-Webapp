import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/service";
import type { User } from "@/models/user.type";
import type { Bet } from "@/models/bet.type";

// Players query keys
export const playersKeys = {
  all: ["players"] as const,
  topScorers: () => [...playersKeys.all, "top-scorers"] as const,
  myBets: () => [...playersKeys.all, "my-bets"] as const,
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

// My bets hook
export const useMyBets = () => {
  return useQuery<Bet[]>({
    queryKey: playersKeys.myBets(),
    queryFn: () => Api.getUserBets(),
    staleTime: 15 * 60 * 1000, // 15 perc (ritkábban változik)
    retry: 2,
  });
};

export const useDeleteBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (betId: string) => Api.deleteBet(betId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() }),
  });
};

export const useUpdateBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ betId, data }: { betId: string; data: Partial<Bet> }) =>
      Api.updateBet(betId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() }),
  });
};
