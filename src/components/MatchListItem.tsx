import { APP_CONFIG } from "@/config";
import type { Match } from "@/models/match.type";
import { getMatchStatusInfo, getMatchTypeText } from "@/utils/common";
import { MatchOutcome, MatchStatus } from "@/utils/enums";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import type { MatchWithUserBet } from "./Matches/types";
import UnknownFlag from "./UnknownFlag";
import { isBettableMatch } from "@/hooks/api/useMatches";
import useGame from "@/hooks/useGame";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

interface MatchListItemProps {
  match: MatchWithUserBet | Match;
  displayTime?: boolean;
  displayDate?: boolean;
  displayStatusBadge?: boolean;
  onSelectMatch?: (match: Match) => void;
  onRowClick?: (match: Match) => void;
}

const MatchListItem = ({
  match,
  displayTime,
  displayDate,
  displayStatusBadge,
  onSelectMatch,
  onRowClick,
}: MatchListItemProps) => {
  const isTeamAWin = match.outcome === MatchOutcome.home;
  const isTeamBWin = match.outcome === MatchOutcome.away;
  const isDraw = match.outcome === MatchOutcome.draw;
  const isFinished = match.status === MatchStatus.finished;
  const comment = match.comment;
  const bets = (match as MatchWithUserBet)?.userbet;

  const { userBetInfo } = useGame();

  const { isUserBetTeamAWin, isUserBetTeamBWin, isUserBetDraw, isUserBet, outcomeBet } =
    userBetInfo(bets || []);

  const betOdds = outcomeBet?.odds;
  const currentBetOdds =
    outcomeBet?.outcome === MatchOutcome.home
      ? match.oddsAwin
      : outcomeBet?.outcome === MatchOutcome.draw
        ? match.oddsDraw
        : outcomeBet?.outcome === MatchOutcome.away
          ? match.oddsBwin
          : undefined;
  const oddsChanged = betOdds != null && currentBetOdds != null && betOdds !== currentBetOdds;
  const oddsWentUp = oddsChanged && currentBetOdds! > betOdds!;

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
      onClick={() => onRowClick?.(match)}
      className="
     hover:bg-gray-700/10 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="text-white/50 text-xs px-1 text-right italic bg-button-bg/20 rounded-md">
          {getMatchTypeText(match.type)}
        </div>
        {(displayTime || displayDate) && match.date && (
          <div
            className="text-xs text-white px-2 py-0.5 flex flex-row
          ml-auto  gap-2"
          >
            {displayTime && <div>{format(new Date(match.date), "HH:mm")}</div>}
            {displayDate && <div>{format(new Date(match.date), "LLL dd")}</div>}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-1 pb-2 pt-2">
        <div className="flex-1 flex gap-2 flex-col">
          <div className="flex items-center gap-2">
            {match.teamA?.flag ? (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
                alt={`${match.teamA.name} flag`}
                className="w-4 h-4 object-cover rounded-full"
              />
            ) : (
              <UnknownFlag size={4} />
            )}
            <span className={`text-sm ${getTeamColor("A")}`}>
              {match.teamA?.name ?? match.teamAPlaceholder ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {match.teamB?.flag ? (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
                alt={`${match.teamB.name} flag`}
                className="w-4 h-4 object-cover rounded-full"
              />
            ) : (
              <UnknownFlag size={4} />
            )}
            <span className={`text-sm ${getTeamColor("B")}`}>
              {match.teamB?.name ?? match.teamBPlaceholder ?? "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 flex-1 justify-end">
          {isBettableMatch(match) && (
            <div
              onClick={() => onSelectMatch && onSelectMatch(match)}
              className={`px-2 py-2 rounded-md text-center 
                ${isUserBet ? "bg-button-secondary-bg" : "bg-button-light"}  
              cursor-pointer text-xs`}
            >
              {isUserBet ? "Módosít" : "Fogadás"}
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
          <div className="flex flex-col items-end text-xs text-gray-400 gap-0.5">
            {[
              { isBet: isUserBetTeamAWin, odds: match.oddsAwin },
              { isBet: isUserBetDraw, odds: match.oddsDraw },
              { isBet: isUserBetTeamBWin, odds: match.oddsBwin },
            ].map(({ isBet, odds }, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 leading-none ${isBet ? "text-white font-semibold" : "text-gray-400"}`}
              >
                {isBet && oddsChanged && (
                  <>
                    <span className="text-[9px] font-normal text-gray-500">
                      ({betOdds!.toFixed(2)})
                    </span>
                    {oddsWentUp ? (
                      <IoArrowUp className="text-green-400 text-[10px]" />
                    ) : (
                      <IoArrowDown className="text-red-400 text-[10px]" />
                    )}
                  </>
                )}
                <span>{odds?.toFixed(2) ?? "-"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {comment && (
        <div className="px-2 text-xs text-gray-400/60 mb-1 italic text-left">{comment}</div>
      )}
    </div>
  );
};

export default MatchListItem;
