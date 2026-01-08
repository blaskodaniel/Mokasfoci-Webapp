import { APP_CONFIG } from "@/config";
import type { Match } from "@/models/match.type";
import { MatchOutcome, MatchStatus } from "@/utils/enums";
import { useCallback } from "react";

interface MatchWithBetsProps {
  match: Match;
}

const MatchWithBets = ({ match }: MatchWithBetsProps) => {
  const isTeamAWin = match.outcome === MatchOutcome.home;
  const isTeamBWin = match.outcome === MatchOutcome.away;
  const isDraw = match.outcome === MatchOutcome.draw;
  const isFinished = match.status === MatchStatus.finished;

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
      className="flex justify-between items-center px-1 pb-2 first:pt-0 pt-2 border-b last:border-0
     border-gray-700/30 hover:bg-primary/10 transition-colors"
    >
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
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">{match.goalA}</div>
          <div className="text-sm">{match.goalB}</div>
        </div>
        <div className="flex flex-col items-center text-xs text-gray-400 gap-0.5">
          <div
            className={`${isFinished && isTeamAWin ? "text-white font-semibold" : "text-gray-400"}`}
          >
            {match.oddsAwin}
          </div>
          <div className={`${isFinished && isDraw ? "text-white font-semibold" : "text-gray-400"}`}>
            {match.oddsDraw}
          </div>
          <div
            className={`${isFinished && isTeamBWin ? "text-white font-semibold" : "text-gray-400"}`}
          >
            {match.oddsBwin}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchWithBets;
