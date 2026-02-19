import { useUpdateBet, useCreateBet, playersKeys } from "@/hooks/api/usePlayers";
import { useNotification } from "@/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CouponType, MatchOutcome } from "@/utils/enums";
import type { MatchWithUserBet } from "@/components/Matches/types";

export interface UseBettingReturn {
  onSubmitOutcomeCoupon: (
    match: MatchWithUserBet,
    betAmount: number,
    outcome: MatchOutcome,
    onSuccess?: () => void
  ) => void;
  onSubmitScoreCoupon: (
    match: MatchWithUserBet,
    betAmount: number,
    homeScore?: number,
    awayScore?: number,
    onSuccess?: () => void
  ) => void;
  isPending: boolean;
}

export const useBetting = (): UseBettingReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const updateBetMutation = useUpdateBet();
  const createBetMutation = useCreateBet();

  const onSubmitOutcomeCoupon = (
    match: MatchWithUserBet,
    betAmount: number,
    outcome: MatchOutcome,
    onSuccess?: () => void
  ) => {
    const currentBet = match.userbet?.find((b) => b.type === CouponType.outcomeBet);
    const editMode = !!currentBet;

    if (editMode && currentBet) {
      updateBetMutation.mutate(
        {
          betId: currentBet?._id,
          data: {
            type: CouponType.outcomeBet,
            amount: betAmount,
            outcome,
          },
        },
        {
          onSuccess: () => {
            showSuccess("A fogadás sikeresen frissítve lett.");
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Error updating bet:", error);
            showError("A fogadás frissítése sikertelen volt.");
          },
        }
      );
    } else {
      createBetMutation.mutate(
        {
          matchId: match._id,
          betAmount,
          type: CouponType.outcomeBet,
          outcome,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
            showSuccess("A fogadás sikeresen létrehozva lett.");
            onSuccess?.();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<{ msg: string }>;
            // Check for status on response first, fallback if needed
            const status =
              axiosError.response?.status || (axiosError as { status?: number }).status;

            if (axiosError instanceof AxiosError && status === 400) {
              if (axiosError.response?.data.msg === "Don't have enough score to bet") {
                showError("Nincs elég pontod a fogadás létrehozásához.");
                return;
              } else if (axiosError.response?.data.msg === "The match has already started") {
                showError("A mérkőzés már elkezdődött, nem lehet fogadni rá.");
                return;
              }
            }
            console.error("Error creating bet:", error);
            showError("A fogadás létrehozása sikertelen volt.");
          },
        }
      );
    }
  };

  const onSubmitScoreCoupon = (
    match: MatchWithUserBet,
    betAmount: number,
    homeScore?: number,
    awayScore?: number,
    onSuccess?: () => void
  ) => {
    const currentBet = match.userbet?.find((b) => b.type === CouponType.scoreBet);
    const editMode = !!currentBet;

    if (editMode && currentBet) {
      updateBetMutation.mutate(
        {
          betId: currentBet?._id,
          data: {
            type: CouponType.scoreBet,
            amount: betAmount,
            scoreTeamA: homeScore,
            scoreTeamB: awayScore,
          },
        },
        {
          onSuccess: () => {
            showSuccess("A fogadás sikeresen frissítve lett.");
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Error updating bet:", error);
            showError("A fogadás frissítése sikertelen volt.");
          },
        }
      );
    } else {
      createBetMutation.mutate(
        {
          matchId: match._id,
          betAmount,
          type: CouponType.scoreBet,
          scoreTeamA: homeScore,
          scoreTeamB: awayScore,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
            showSuccess("A fogadás sikeresen létrehozva lett.");
            onSuccess?.();
          },
          onError: (error) => {
            const axiosError = error as AxiosError<{ msg: string }>;
            // Check for status on response first, fallback if needed
            const status =
              axiosError.response?.status || (axiosError as { status?: number }).status;

            if (axiosError instanceof AxiosError && status === 400) {
              if (axiosError.response?.data.msg === "Don't have enough score to bet") {
                showError("Nincs elég pontod a fogadás létrehozásához.");
                return;
              } else if (axiosError.response?.data.msg === "The match has already started") {
                showError("A mérkőzés már elkezdődött, nem lehet fogadni rá.");
                return;
              }
            }
            console.error("Error creating bet:", error);
            showError("A fogadás létrehozása sikertelen volt.");
          },
        }
      );
    }
  };

  return {
    onSubmitOutcomeCoupon,
    onSubmitScoreCoupon,
    isPending: updateBetMutation.isPending || createBetMutation.isPending,
  };
};
