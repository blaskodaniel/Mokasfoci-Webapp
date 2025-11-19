import type { Match } from "@/models/match.type";
import { MatchStatus } from "@/utils/enums";

interface MatchRowProps {
  match: Match;
}

const MatchInLine = ({ match }: MatchRowProps) => {
  return (
    <div
      className="mb-2 flex justify-center items-center gap-2 p-1 
    rounded-lg border border-primary bg-tertiary/30"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{match.teamA?.name}</span>
        {match.teamA?.flag && (
          <img
            src={`/src/assets/flags/${match.teamA.flag}`}
            alt={`${match.teamA.name} flag`}
            className="w-5 h-5 object-cover rounded-full"
          />
        )}
      </div>

      <div className="flex flex-col items-center mx-2">
        {match.goalA && match.goalB && match.status === MatchStatus.finished ? (
          <div className="flex gap-1 items-center">
            <span className="">{match.goalA}</span>
            <span>:</span>
            <span className="">{match.goalB}</span>
          </div>
        ) : (
          <span className="text-sm">-</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {match.teamB?.flag && (
          <img
            src={`/src/assets/flags/${match.teamB.flag}`}
            alt={`${match.teamB.name} flag`}
            className="w-5 h-5 object-cover rounded-full"
          />
        )}
        <span className="text-sm">{match.teamB?.name}</span>
      </div>
    </div>
  );
};

export default MatchInLine;
