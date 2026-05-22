import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import type { Match } from "@/models/match.type";
import { MatchOutcome } from "@/utils/enums";
import type { FC } from "react";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

interface MatchOutcomeSelectorProps {
  match: Match;
  selectedOutcome: MatchOutcome | null;
  onSelectOutcome: (outcome: MatchOutcome) => void;
  showDraw?: boolean;
  existingOutcome?: MatchOutcome;
  existingOdds?: number;
}

const MatchOutcomeSelector: FC<MatchOutcomeSelectorProps> = ({
  selectedOutcome,
  onSelectOutcome,
  match,
  showDraw = true,
  existingOutcome,
  existingOdds,
}) => {
  const { userFavoriteTeam } = useGame();
  const { config } = useConfig();

  const renderOdds = (outcome: MatchOutcome, currentMatchOdds: number | null | undefined) => {
    const isExisting = existingOutcome === outcome && existingOdds != null;
    const changed = isExisting && currentMatchOdds != null && currentMatchOdds !== existingOdds;
    const wentUp = changed && currentMatchOdds! > existingOdds!;

    if (isExisting && changed) {
      return (
        <span className="flex items-center justify-center gap-1.5">
          <span className="line-through text-white/40 font-normal text-xs">
            {existingOdds!.toFixed(2)}
          </span>
          <span className="flex items-center gap-0.5">
            {wentUp
              ? <IoArrowUp className="text-green-400" size={12} />
              : <IoArrowDown className="text-red-400" size={12} />}
            <span>{currentMatchOdds!.toFixed(2)}</span>
          </span>
        </span>
      );
    }

    if (isExisting) return <span>{existingOdds!.toFixed(2)}</span>;

    if (userFavoriteTeam(match)) {
      return (
        <span>
          {currentMatchOdds?.toFixed(2)}{" "}
          <span className="text-green-500">x{config?.favoritTeamFactor}</span>
        </span>
      );
    }
    return <span>{currentMatchOdds?.toFixed(2) || "-"}</span>;
  };

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
        <p className="font-thin">{match.teamA?.tla || "??"}</p>
        <p className="font-bold">{renderOdds(MatchOutcome.home, match.oddsAwin)}</p>
      </div>
      {showDraw && (
        <div
          onClick={() => onSelectOutcome(MatchOutcome.draw)}
          className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1
                    cursor-pointer transition-colors duration-300 ${
                      selectedOutcome === MatchOutcome.draw
                        ? "bg-button-light text-white border-primary"
                        : "border-gray-300/20 hover:bg-primary/20"
                    }`}
        >
          <p className="font-thin">döntetlen</p>
          <p className="font-bold">{renderOdds(MatchOutcome.draw, match.oddsDraw)}</p>
        </div>
      )}
      <div
        onClick={() => onSelectOutcome(MatchOutcome.away)}
        className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1
                  cursor-pointer transition-colors duration-300 ${
                    selectedOutcome === MatchOutcome.away
                      ? "bg-button-light text-white border-primary"
                      : "border-gray-300/20 hover:bg-primary/20"
                  }`}
      >
        <p className="font-thin">{match.teamB?.tla || "??"}</p>
        <p className="font-bold">{renderOdds(MatchOutcome.away, match.oddsBwin)}</p>
      </div>
    </div>
  );
};

export default MatchOutcomeSelector;
