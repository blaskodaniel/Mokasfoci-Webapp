import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/service";
import type { User } from "@/models/user.type";
import type { Bet } from "@/models/bet.type";
import { useAppDispatch } from "@/state/hooks";
import { getMeAction } from "@/state/authSlice";
import { MatchOutcome } from "@/utils/enums";
import type { Transaction } from "@/models/transaction.type";

// Players query keys
export const playersKeys = {
  all: ["players"] as const,
  toplist: () => [...playersKeys.all, "toplist"] as const,
  myBets: () => [...playersKeys.all, "my-bets"] as const,
  myTransactions: () => [...playersKeys.all, "my-transactions"] as const,
};

// Toplist hook
export const useToplist = () => {
  return useQuery<User[]>({
    queryKey: [...playersKeys.toplist()],
    queryFn: () => Api.getToplist(),
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
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (betId: string) => Api.deleteBet(betId),
    onSuccess: () => {
      // React Query cache invalidation
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
      dispatch(getMeAction());
    },
  });
};

export const useUpdateBet = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ betId, data }: { betId: string; data: Partial<Bet> }) =>
      Api.updateBet(betId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
      dispatch(getMeAction());
    },
  });
};

export const useCreateBet = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({
      matchId,
      betAmount,
      outcome,
    }: {
      matchId: string;
      betAmount: number;
      outcome: MatchOutcome;
    }) => Api.createBet(matchId, betAmount, outcome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
      dispatch(getMeAction());
    },
  });
};

export const useMyTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: playersKeys.myTransactions(),
    queryFn: () => Api.getUserTransactions(),
    staleTime: 15 * 60 * 1000, // 15 perc (ritkábban változik)
    retry: 2,
  });
};
