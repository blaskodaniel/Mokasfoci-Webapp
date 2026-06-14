import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { CouponType, MatchOutcome } from "@/utils/enums";
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import type { User } from "@/models/user.type";
import type { Team } from "@/models/team.type";

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

  // A user kedvenc csapata (data.teamid) lehet sima id string vagy populált team objektum is,
  // attól függően, melyik endpoint adta vissza – mindkettőt kezeljük.
  const resolveTeamId = (teamid: unknown): string | null => {
    if (!teamid) return null;

    if (typeof teamid === "string") return teamid;
    return (teamid as { _id?: string })._id ?? null;
  };

  // Visszaadja a meccs azon csapatát, amelyik a user kedvence – ha egyik sem, akkor null.
  const getFavoriteTeam = (user: User | undefined, match: Match): Team | undefined => {
    const favId = resolveTeamId(user?.data?.teamid);
    if (!favId) return undefined;

    if (resolveTeamId(match.teamA)?.toString() === favId.toString()) return match.teamA;
    if (resolveTeamId(match.teamB)?.toString() === favId.toString()) return match.teamB;
    return undefined;
  };

  return {
    userFavoriteTeam,
    userBetInfo,
    getFavoriteTeam,
  };
};

export default useGame;
