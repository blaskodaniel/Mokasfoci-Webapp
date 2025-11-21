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
      className="w-full sm:w-100 bg-black/20 px-4 py-6 rounded-lg mb-4 flex flex-col gap-4 cursor-pointer hover:bg-black/30 transition-colors"
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
          <span className="text-lg">{match.teamA?.name}</span>
        </div>
        <div className="flex-1 justify-center items-center flex flex-col gap-2">
          <div className="flex justify-center items-center text-sm text-gray-400">
            {match.date
              ? format(new Date(match.date), "LLL dd HH:mm")
              : "nincs dátum"}
          </div>
          <div className="text-xl text-gray-400">vs.</div>
          <div className="flex gap-3">
            <div className="text-sm">{match.oddsAwin}</div>
            <div className="text-sm">{match.oddsDraw}</div>
            <div className="text-sm">{match.oddsBwin}</div>
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
          <span className="text-lg">{match.teamB?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
