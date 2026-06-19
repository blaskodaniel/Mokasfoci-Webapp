import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "@/services/service";
import type { Bet } from "@/models/bet.type";
import { useAuth } from "@/hooks/useAuth";
import { MatchOutcome, CouponType } from "@/utils/enums";
import type { Transaction } from "@/models/transaction.type";
import type {
  BalanceHistoryEntry,
  DefaultAvatar,
  ScoreByMatchResponse,
  ToplistResponse,
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
  return useQuery<ToplistResponse>({
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
    select: (bets) =>
      [...bets].sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return String(b._id).localeCompare(String(a._id));
      }),
    staleTime: 15 * 60 * 1000, // 15 perc (ritkábban változik)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useDeleteBet = () => {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();

  return useMutation({
    mutationFn: (betId: string) => Api.deleteBet(betId),
    onSuccess: () => {
      // React Query cache invalidation
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
      refreshMe();
    },
  });
};

export const useUpdateBet = () => {
  const { refreshMe } = useAuth();

  return useMutation({
    mutationFn: ({ betId, data }: { betId: string; data: Partial<Bet> }) =>
      Api.updateBet(betId, data),
    onSuccess: () => {
      refreshMe();
    },
  });
};

export const useCreateBet = () => {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();

  return useMutation({
    mutationFn: ({
      matchId,
      betAmount,
      outcome,
      type,
      scoreTeamA,
      scoreTeamB,
    }: {
      matchId: string;
      betAmount: number;
      outcome?: MatchOutcome;
      type: CouponType;
      scoreTeamA?: number;
      scoreTeamB?: number;
    }) =>
      Api.createBet({
        matchId,
        amount: betAmount,
        outcome,
        type,
        scoreTeamA,
        scoreTeamB,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
      refreshMe();
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
  const { refreshMe } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateUserProfileBody) => Api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.all });
      refreshMe();
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
