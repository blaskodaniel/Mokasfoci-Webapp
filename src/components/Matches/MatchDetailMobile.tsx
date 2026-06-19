import type { Bet } from "@/models/bet.type";
import UserDisplay from "@/components/UserDisplay";
import FavoriteTeamBadge from "@/components/Matches/FavoriteTeamBadge";
import { outcomeText, potentialWinnings } from "@/utils/common";
import { CouponType, MatchStatus } from "@/utils/enums";
import { useCallback, type FC } from "react";
import type { Match } from "@/models/match.type";
import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";

interface MatchDetailMobileProps {
  bets: Bet[];
  match: Match;
}

const MatchDetailMobile: FC<MatchDetailMobileProps> = ({ bets, match }) => {
  const matchStatus = match.status;
  const { getFavoriteTeam } = useGame();
  const { config } = useConfig();
  const isFinished = matchStatus === MatchStatus.finished;

  const sorting = (a: Bet, b: Bet) => {
    if (match.status === MatchStatus.playing) {
      return a.amount - b.amount;
    }
    if (match.status === MatchStatus.finished) {
      return (b.totalWin ?? 0) - (a.totalWin ?? 0);
    }
    return 0;
  };

  const isShowOdds = useCallback(
    (bet: Bet) => {
      const isShowOutComeCase = bet.type === CouponType.outcomeBet && (bet.success || !isFinished);
      const isShowScoreCase = bet.type === CouponType.scoreBet && bet.success;
      return isShowOutComeCase || isShowScoreCase;
    },
    [isFinished]
  );

  return (
    <div className="flex flex-col gap-2">
      {bets.length === 0 && (
        <div className="text-center text-gray-400 py-6 text-sm">
          {match.status === MatchStatus.finished
            ? "Erre a mérkőzésre nem fogadtak"
            : "Még nincsenek fogadások"}
        </div>
      )}
      {bets.sort(sorting).map((bet) => {
        const favoriteTeam = getFavoriteTeam(bet.userid, match);
        return (
          <div
            key={bet._id}
            className="rounded-lg shadow bg-linear-to-br from-[#0e111b] to-[#01111f] 
            px-3 py-2 border flex flex-col gap-1 mx-3 border-[#00000070]"
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5 justify-between w-full">
                <UserDisplay user={bet.userid!} showAvatar={true} avatarSize="sm" />
                {bet.type === CouponType.outcomeBet && (
                  <FavoriteTeamBadge user={bet.userid} match={match} variant="pill" />
                )}
              </div>
              {isFinished && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    bet.success ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {bet.success ? "Nyert" : "Vesztett"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <div className="flex-1 min-w-[90px]">
                <span className="text-gray-400">Tipp: </span>
                {bet.type === CouponType.outcomeBet && (
                  <span className="font-semibold text-white">{outcomeText(bet, match)}</span>
                )}
                {bet.type === CouponType.scoreBet && (
                  <span className="font-semibold text-white">
                    {bet.scoreTeamA} - {bet.scoreTeamB}
                  </span>
                )}
              </div>
              {isShowOdds(bet) && (
                <div className="flex-1 min-w-[60px]">
                  <span className="text-gray-400">Odds: </span>
                  <span className="font-semibold text-white">{bet.odds}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <div className="flex-1 min-w-[60px]">
                <span className="text-gray-400">Tét: </span>
                <span className="font-semibold text-white">{bet.amount}</span>
              </div>
              {bet.type === CouponType.outcomeBet &&
                ((bet.success && isFinished) || match.status === MatchStatus.playing) && (
                  <div className="flex-1 min-w-[70px]">
                    <span className="text-gray-400">Nyeremény: </span>
                    <span className="font-semibold text-white">
                      {bet.success && isFinished
                        ? bet.totalWin
                        : match.status === MatchStatus.playing
                          ? potentialWinnings(
                              bet.amount,
                              bet.odds,
                              favoriteTeam ? config?.favoritTeamFactor : 1
                            )
                          : null}
                    </span>
                  </div>
                )}
              {bet.type === CouponType.scoreBet && bet.success && (
                <div className="flex-1 min-w-[70px]">
                  <span className="text-gray-400">Nyeremény: </span>
                  <span className="font-semibold text-white">{bet.totalWin ?? "-"}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchDetailMobile;
