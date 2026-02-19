import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { useAppSelector } from "@/state/hooks";
import { CouponType, MatchOutcome } from "@/utils/enums";
import { useCallback } from "react";

const useGame = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

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
    const isUserBetScore = scoreBet?.scoreA !== undefined && scoreBet?.scoreB !== undefined;
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
