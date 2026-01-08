import { APP_CONFIG } from "@/config";
import type { Match } from "@/models/match.type";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCard = ({ match, onClick }: MatchCardProps) => {
  return (
    <div
      className="w-full sm:w-100 bg-black/20 px-4 py-6 rounded-lg flex flex-col gap-4 
      cursor-pointer hover:bg-black/30 transition-colors"
      onClick={() => onClick?.(match)}
    >
      <div className="flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          {match.teamA?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
              alt={`${match.teamA.name} flag`}
              className="w-12 h-12 object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex-1 justify-center items-center flex flex-col gap-2">
          <div className="flex justify-center items-center text-sm text-gray-400">
            {match.date ? format(new Date(match.date), "LLL dd") : "nincs dátum"}
          </div>
          <div className="text-xl text-white font-bold">
            {match.date ? format(new Date(match.date), "HH:mm") : "nincs dátum"}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          {match.teamB?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
              alt={`${match.teamB.name} flag`}
              className="w-12 h-12 object-cover rounded-full"
            />
          )}
        </div>
      </div>
      <div className="flex gap-3 border-t border-gray-700/30 pt-3 text-gray-400 text-center">
        <div className="text-sm flex-1 border-r border-gray-700/30">{match.oddsAwin}</div>
        <div className="text-sm flex-1 border-r border-gray-700/30">{match.oddsDraw}</div>
        <div className="text-sm flex-1">{match.oddsBwin}</div>
      </div>
    </div>
  );
};

export default MatchCard;
