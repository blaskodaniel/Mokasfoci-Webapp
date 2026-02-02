import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/service";
import type { User } from "@/models/user.type";
import type { Bet } from "@/models/bet.type";
import { useAppDispatch } from "@/state/hooks";
import { getMeAction } from "@/state/authSlice";
import { MatchOutcome } from "@/utils/enums";
import type { Transaction } from "@/models/transaction.type";
import type {
  BalanceHistoryEntry,
  DefaultAvatar,
  ScoreByMatchResponse,
  UpdateUserProfileBody,
  WinLostStats,
} from "@/services/types";

// Players query keys
export const playersKeys = {
  all: ["players"] as const,
  toplist: () => [...playersKeys.all, "toplist"] as const,
  myBets: () => [...playersKeys.all, "my-bets"] as const,
  myTransactions: () => [...playersKeys.all, "my-transactions"] as const,
  getDefaultAvatars: () => [...playersKeys.all, "default-avatars"] as const,
  getBalanceHistory: () => [...playersKeys.all, "balance-history"] as const,
  getWinLostStats: (userId?: string) => [...playersKeys.all, "win-loss-stats", userId] as const,
  getScoreByMatches: (userids?: string[]) =>
    [...playersKeys.all, "score-by-matches", userids] as const,
  getPlayerDetails: (userId: string) => [...playersKeys.all, "player-details", userId] as const,
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
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ betId, data }: { betId: string; data: Partial<Bet> }) =>
      Api.updateBet(betId, data),
    onSuccess: () => {
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateUserProfileBody) => Api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.all });
      dispatch(getMeAction());
    },
  });
};

export const useGetDefaultAvatar = () => {
  return useQuery<DefaultAvatar[]>({
    queryKey: playersKeys.getDefaultAvatars(),
    queryFn: () => Api.getDefaultAvatars(),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      return Api.uploadAvatar(formData);
    },
    onSuccess: () => {
      // cache-t invalidáljuk
      queryClient.invalidateQueries({ queryKey: playersKeys.all });
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarFilename: string) => {
      return Api.updateAvatar(avatarFilename);
    },
    onSuccess: () => {
      // cache-t invalidáljuk
      queryClient.invalidateQueries({ queryKey: playersKeys.all });
    },
  });
};

export const useBalanceHistory = (from?: string, to?: string, userId?: string) => {
  return useQuery<BalanceHistoryEntry[]>({
    queryKey: playersKeys.getBalanceHistory(),
    queryFn: () => Api.getBalanceHistory({ from, to, userId }),
    staleTime: 15 * 60 * 1000, // 15 perc
    retry: 2,
  });
};

export const useWinLostStats = (userId?: string) => {
  return useQuery<WinLostStats>({
    queryKey: playersKeys.getWinLostStats(userId),
    queryFn: () => Api.getWinLostStats(userId),
    retry: 2,
  });
};

export const useScoreByMatches = (userids?: string[]) => {
  return useQuery<ScoreByMatchResponse>({
    queryKey: playersKeys.getScoreByMatches(userids),
    queryFn: () => Api.getScoreByMatches(userids),
    retry: 2,
  });
};

export const useGetPlayerDetails = (userId: string) => {
  return useQuery({
    queryKey: playersKeys.getPlayerDetails(userId),
    queryFn: () => Api.getPlayerDetails(userId),
    staleTime: 15 * 60 * 1000, // 15 perc
    retry: 2,
  });
};
