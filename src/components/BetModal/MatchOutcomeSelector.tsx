import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import type { Match } from "@/models/match.type";
import { MatchOutcome } from "@/utils/enums";
import type { FC } from "react";

interface MatchOutcomeSelectorProps {
  match: Match;
  selectedOutcome: MatchOutcome | null;
  onSelectOutcome: (outcome: MatchOutcome) => void;
}

const MatchOutcomeSelector: FC<MatchOutcomeSelectorProps> = ({
  selectedOutcome,
  onSelectOutcome,
  match,
}) => {
  const { userFavoriteTeam } = useGame();
  const { config } = useConfig();
  return (
    <div className="flex justify-center items-center gap-3 sm:gap-5 px-1 sm:px-6">
      <div
        onClick={() => onSelectOutcome(MatchOutcome.home)}
        className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
                  cursor-pointer transition-colors duration-300 ${
                    selectedOutcome === MatchOutcome.home
                      ? "bg-button-light text-white border-primary"
                      : "border-gray-300/20 hover:bg-primary/20"
                  }`}
      >
        <p>{match.teamA?.name}</p>{" "}
        <p>
          {userFavoriteTeam(match) ? (
            <span>
              {match.oddsAwin} <span className="text-green-500">x{config?.favoritTeamFactor}</span>
            </span>
          ) : (
            match.oddsAwin?.toFixed(2)
          )}
        </p>
      </div>
      <div
        onClick={() => onSelectOutcome(MatchOutcome.draw)}
        className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
                  cursor-pointer transition-colors duration-300 ${
                    selectedOutcome === MatchOutcome.draw
                      ? "bg-button-light text-white border-primary"
                      : "border-gray-300/20 hover:bg-primary/20"
                  }`}
      >
        <p>döntetlen</p>{" "}
        <p>
          {userFavoriteTeam(match) ? (
            <span>
              {match.oddsDraw} <span className="text-green-500">x{config?.favoritTeamFactor}</span>
            </span>
          ) : (
            match.oddsDraw?.toFixed(2)
          )}
        </p>
      </div>
      <div
        onClick={() => onSelectOutcome(MatchOutcome.away)}
        className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
                  cursor-pointer transition-colors duration-300 ${
                    selectedOutcome === MatchOutcome.away
                      ? "bg-button-light text-white border-primary"
                      : "border-gray-300/20 hover:bg-primary/20"
                  }`}
      >
        <p>{match.teamB?.name}</p>{" "}
        <p>
          {userFavoriteTeam(match) ? (
            <span>
              {match.oddsBwin} <span className="text-green-500">x{config?.favoritTeamFactor}</span>
            </span>
          ) : (
            match.oddsBwin?.toFixed(2)
          )}
        </p>
      </div>
    </div>
  );
};

export default MatchOutcomeSelector;
