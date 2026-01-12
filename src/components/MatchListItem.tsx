import { APP_CONFIG } from "@/config";
import type { Match } from "@/models/match.type";
import { getMatchStatusInfo } from "@/utils/common";
import { MatchOutcome, MatchStatus } from "@/utils/enums";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import type { MatchWithUserBet } from "./Matches/types";

interface MatchListItemProps {
  match: MatchWithUserBet | Match;
  displayTime?: boolean;
  displayStatusBadge?: boolean;
  onSelectMatch?: (match: Match) => void;
}

const MatchListItem = ({
  match,
  displayTime,
  displayStatusBadge,
  onSelectMatch,
}: MatchListItemProps) => {
  const isTeamAWin = match.outcome === MatchOutcome.home;
  const isTeamBWin = match.outcome === MatchOutcome.away;
  const isDraw = match.outcome === MatchOutcome.draw;
  const isFinished = match.status === MatchStatus.finished;
  const comment = match.comment;
  const bet = (match as MatchWithUserBet).userbet;
  const isUserBetTeamAWin = bet?.outcome === MatchOutcome.home;
  const isUserBetTeamBWin = bet?.outcome === MatchOutcome.away;
  const isUserBetDraw = bet?.outcome === MatchOutcome.draw;

  const statusInfoBadge = useMemo(() => {
    return getMatchStatusInfo(match.status);
  }, [match.status]);

  const getTeamColor = useCallback(
    (teamType: "A" | "B") => {
      if (!isFinished) return "text-white";

      const isWinner =
        (teamType === "A" && isTeamAWin) || (teamType === "B" && isTeamBWin) || isDraw;

      return isWinner ? "text-white" : "text-gray-400";
    },
    [isFinished, isTeamAWin, isTeamBWin, isDraw]
  );

  return (
    <div
      className="
     hover:bg-gray-700/10 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-center px-1 pb-2 pt-2">
        {displayTime && match.date && (
          <div className="pr-3 text-xs text-gray-400 text-center">
            {format(new Date(match.date), "HH:mm")}
          </div>
        )}
        <div className="flex-1 flex gap-2 flex-col">
          <div className="flex items-center gap-2">
            {match.teamA?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
                alt={`${match.teamA.name} flag`}
                className="w-4 h-4 object-cover rounded-full"
              />
            )}
            <span className={`text-sm ${getTeamColor("A")}`}>{match.teamA?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {match.teamB?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
                alt={`${match.teamB.name} flag`}
                className="w-4 h-4 object-cover rounded-full"
              />
            )}
            <span className={`text-sm ${getTeamColor("B")}`}>{match.teamB?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-5 flex-1 justify-end">
          {match.status === MatchStatus.enabled && !bet && (
            <div
              onClick={() => onSelectMatch && onSelectMatch(match)}
              className="px-2 py-2 rounded-md text-center bg-button-light hover:bg-button-light-hover cursor-pointer text-xs"
            >
              Fogadás
            </div>
          )}
          {displayStatusBadge && match.status !== MatchStatus.enabled && (
            <div
              className={`px-1.5 py-1 rounded-md text-xs ${statusInfoBadge.color} ${statusInfoBadge.className}`}
            >
              {statusInfoBadge.text}
            </div>
          )}
          {match.goalA !== undefined && match.goalB !== undefined && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm">{match.goalA}</div>
              <div className="text-sm">{match.goalB}</div>
            </div>
          )}
          <div className="flex flex-col items-center text-xs text-gray-400 gap-0.5">
            <div className={`${isUserBetTeamAWin ? "text-white font-semibold" : "text-gray-400"}`}>
              {match.oddsAwin}
            </div>
            <div className={`${isUserBetDraw ? "text-white font-semibold" : "text-gray-400"}`}>
              {match.oddsDraw}
            </div>
            <div className={`${isUserBetTeamBWin ? "text-white font-semibold" : "text-gray-400"}`}>
              {match.oddsBwin}
            </div>
          </div>
        </div>
      </div>

      {comment && (
        <div className="px-1 text-xs text-gray-400/60 mb-1 italic text-right">{comment}</div>
      )}
    </div>
  );
};

export default MatchListItem;
