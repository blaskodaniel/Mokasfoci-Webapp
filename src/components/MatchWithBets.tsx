import type { Match } from "@/models/match.type";
import { useCallback } from "react";

interface MatchWithBetsProps {
  match: Match;
}

const MatchWithBets = ({ match }: MatchWithBetsProps) => {
  const isTeamAWin = match.goalA! > match.goalB!;
  const isTeamBWin = match.goalB! > match.goalA!;
  const isDraw = match.goalA! === match.goalB!;

  const getTeamColor = useCallback(
    (teamType: string) => {
      if (!match.goalA || !match.goalB) return "text-white";
      if (teamType === "A") {
        if (match.goalA > match.goalB) return "text-white";
        if (match.goalA < match.goalB) return "text-gray-400";
      } else {
        if (match.goalB > match.goalA) return "text-white";
        if (match.goalB < match.goalA) return "text-gray-400";
      }
      return "text-white";
    },
    [match.goalA, match.goalB]
  );

  return (
    <div
      className="flex justify-between items-center px-2 py-1 border border-primary rounded-lg 
    mb-2 bg-tertiary/30"
    >
      <div className="flex-1 flex gap-2 flex-col">
        <div className="flex items-center gap-2">
          {match.teamA?.flag && (
            <img
              src={`/src/assets/flags/${match.teamA.flag}`}
              alt={`${match.teamA.name} flag`}
              className="w-5 h-5 object-cover rounded-full"
            />
          )}
          <span className={`text-sm ${getTeamColor("A")}`}>
            {match.teamA?.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {match.teamB?.flag && (
            <img
              src={`/src/assets/flags/${match.teamB.flag}`}
              alt={`${match.teamB.name} flag`}
              className="w-5 h-5 object-cover rounded-full"
            />
          )}
          <span className={`text-sm ${getTeamColor("B")}`}>
            {match.teamB?.name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-5 flex-1 justify-end">
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">{match.goalA}</div>
          <div className="text-sm">{match.goalB}</div>
        </div>
        <div className="flex flex-col items-center text-xs text-gray-400 gap-0.5">
          <div
            className={`${
              isTeamAWin ? "bg-white text-black" : "text-gray-400"
            }`}
          >
            {match.oddsAwin}
          </div>
          <div className={`${isDraw ? "text-white" : "text-gray-400"}`}>
            {match.oddsDraw}
          </div>
          <div className={`${isTeamBWin ? "text-white" : "text-gray-400"}`}>
            {match.oddsBwin}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchWithBets;
