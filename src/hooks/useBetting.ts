import { useUpdateBet, useCreateBet, playersKeys } from "@/hooks/api/usePlayers";
import { useNotification } from "@/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MatchOutcome } from "@/utils/enums";
import type { MatchWithUserBet } from "@/components/Matches/types";

export interface UseBettingReturn {
  onSubmitCoupon: (
    match: MatchWithUserBet,
    betAmount: number,
    outcome: MatchOutcome,
    onSuccess?: () => void
  ) => void;
  isPending: boolean;
}

export const useBetting = (): UseBettingReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const updateBetMutation = useUpdateBet();
  const createBetMutation = useCreateBet();

  const onSubmitCoupon = (
    match: MatchWithUserBet,
    betAmount: number,
    outcome: MatchOutcome,
    onSuccess?: () => void
  ) => {
    const editMode = !!match.userbet;

    if (editMode && match.userbet) {
      updateBetMutation.mutate(
        {
          betId: match.userbet._id,
          data: {
            amount: betAmount,
            outcome: outcome,
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

  return {
    onSubmitCoupon,
    isPending: updateBetMutation.isPending || createBetMutation.isPending,
  };
};
