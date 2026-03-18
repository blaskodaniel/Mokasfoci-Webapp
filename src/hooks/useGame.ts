import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { CouponType, MatchOutcome } from "@/utils/enums";
import { useCallback } from "react";
import { useAuth } from "./useAuth";

const useGame = () => {
  const { user: currentUser } = useAuth();

  const userFavoriteTeam = useCallback(
    (match: Match) => {
      if (currentUser?.data.teamid?.toString() === match.teamA?._id.toString()) return match.teamA;
      if (currentUser?.data.teamid?.toString() === match.teamB?._id.toString()) return match.teamB;
      return;
    },
    [currentUser?.data?.teamid]
  );

  const userBetInfo = useCallback((bets: Bet[]) => {
    const outcomeBet = bets?.find((x) => x.type === CouponType.outcomeBet);
    const scoreBet = bets?.find((x) => x.type === CouponType.scoreBet);
    const isUserBetTeamAWin = outcomeBet?.outcome === MatchOutcome.home;
    const isUserBetTeamBWin = outcomeBet?.outcome === MatchOutcome.away;
    const isUserBetDraw = outcomeBet?.outcome === MatchOutcome.draw;
    const isUserBetScore = scoreBet?.scoreTeamA !== undefined && scoreBet?.scoreTeamB !== undefined;
    const isUserBet = isUserBetTeamAWin || isUserBetTeamBWin || isUserBetDraw || isUserBetScore;
    return {
      isUserBetTeamAWin,
      isUserBetTeamBWin,
      isUserBetDraw,
      isUserBetScore,
      isUserBet,
      outcomeBet,
      scoreBet,
    };
  }, []);

  return {
    userFavoriteTeam,
    userBetInfo,
  };
};

export default useGame;
