import { APP_CONFIG } from "@/config";
import { getDateDisplay } from "@/utils/dateTimefn";
import { format } from "date-fns";
import { MatchOutcome } from "@/utils/enums";
import type { MatchWithUserBet } from "./Matches/types";
import useGame from "@/hooks/useGame";
import UnknownFlag from "./UnknownFlag";

interface MatchCardProps {
  match: MatchWithUserBet;
  onClick?: (match: MatchWithUserBet) => void;
  className?: string;
  flagSize?: "small" | "large";
  badge?: string;
}

const MatchCard = ({ match, onClick, className, flagSize = "large", badge }: MatchCardProps) => {
  const defaultWrapperClass = "px-4 py-6";
  const userBet = match.userbet;
  const { userBetInfo } = useGame();

  const { outcomeBet, scoreBet } = userBetInfo(userBet || []);

  const getOddsClass = (outcome: MatchOutcome) => {
    const baseClass = "text-sm flex-1 py-1 rounded transition-colors duration-200 border";
    if (outcomeBet && outcomeBet?.outcome === outcome) {
      return `${baseClass} bg-green-600/20 text-green-400 font-bold border-green-500/50`;
    }
    return `${baseClass} border-transparent text-gray-400`;
  };

  return (
    <div
      className={`w-full sm:w-100 bg-black/20 rounded-lg flex flex-col gap-4 
      cursor-pointer hover:bg-black/30 transition-colors relative ${className || defaultWrapperClass}`}
      onClick={() => onClick?.(match)}
    >
      {badge && (
        <div
          className="absolute top-0 right-0 bg-amber-500/20 px-2.5 py-1 rounded-bl-lg 
            border border-amber-500/30 flex items-center justify-center"
        >
          <span className="text-[9px] leading-none text-amber-500 font-bold text-center">
            {badge}
          </span>
        </div>
      )}
      <div className="flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          {match.teamA?.flag ? (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
              alt={`${match.teamA.name} flag`}
              className={
                flagSize === "small"
                  ? "w-8 h-8 object-cover rounded-full"
                  : "w-12 h-12 object-cover rounded-full"
              }
            />
          ) : (
            <UnknownFlag size={flagSize === "small" ? 8 : 12} />
          )}
        </div>
        <div
          className={`flex-1 justify-center items-center flex flex-col ${scoreBet && scoreBet.scoreTeamA !== undefined ? "gap-0.5" : "gap-2"}`}
        >
          <div
            className={`flex justify-center items-center text-gray-400 ${scoreBet && scoreBet.scoreTeamA !== undefined ? "text-xs" : "text-sm"}`}
          >
            {match.date ? getDateDisplay(new Date(match.date)) : "nincs dátum"}
          </div>
          <div
            className={`text-white font-bold ${scoreBet && scoreBet.scoreTeamA !== undefined ? "text-lg leading-tight" : "text-xl"}`}
          >
            {match.date ? format(new Date(match.date), "HH:mm") : "nincs dátum"}
          </div>
          {scoreBet && scoreBet.scoreTeamA !== undefined && (
            <div
              className="flex items-center gap-1 mt-0.5 bg-amber-500/20 px-2.5 py-0.5 rounded-full 
            border border-amber-500/30"
            >
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider leading-none translate-y-[0.5px]">
                Tipp:
              </span>
              <span className="text-[11px] text-amber-400 font-black leading-none">
                {scoreBet.scoreTeamA} - {scoreBet.scoreTeamB}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          {match.teamB?.flag ? (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
              alt={`${match.teamB.name} flag`}
              className="w-12 h-12 object-cover rounded-full"
            />
          ) : (
            <UnknownFlag size={flagSize === "small" ? 8 : 12} />
          )}
        </div>
      </div>
      <div className="flex gap-1 border-t border-gray-700/30 pt-3 text-center">
        <div className={getOddsClass(MatchOutcome.home)}>
          {match.oddsAwin ? match.oddsAwin?.toFixed(2) : "-"}
        </div>
        <div className={getOddsClass(MatchOutcome.draw)}>
          {match.oddsDraw ? match.oddsDraw?.toFixed(2) : "-"}
        </div>
        <div className={getOddsClass(MatchOutcome.away)}>
          {match.oddsBwin ? match.oddsBwin?.toFixed(2) : "-"}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
