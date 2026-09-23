import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import type { Match } from "@/models/match.type";
import { MatchOutcome } from "@/utils/enums";
import type { FC } from "react";
import { IoArrowUp, IoArrowDown, IoStar } from "react-icons/io5";

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
  const favoriteTeam = userFavoriteTeam(match);

  const renderOdds = (outcome: MatchOutcome, currentMatchOdds: number | null | undefined) => {
    const isExisting = existingOutcome === outcome && existingOdds != null;
    const changed = isExisting && currentMatchOdds != null && currentMatchOdds !== existingOdds;
    const wentUp = changed && currentMatchOdds! > existingOdds!;

    if (isExisting && changed) {
      return (
        <span className="flex items-center justify-center gap-1.5">
          <span className="text-xs font-normal text-white/40 line-through">
            {existingOdds!.toFixed(2)}
          </span>
          <span className="flex items-center gap-0.5">
            {wentUp ? (
              <IoArrowUp className="text-badge-success" size={12} />
            ) : (
              <IoArrowDown className="text-badge-live" size={12} />
            )}
            <span>{currentMatchOdds!.toFixed(2)}</span>
          </span>
        </span>
      );
    }

    if (isExisting) return <span>{existingOdds!.toFixed(2)}</span>;

    if (favoriteTeam) {
      return (
        <span>
          {currentMatchOdds?.toFixed(2)}{" "}
          <span className="text-badge-amber">x{config?.favoritTeamFactor}</span>
        </span>
      );
    }
    return <span>{currentMatchOdds?.toFixed(2) || "-"}</span>;
  };

  const outcomeTile = (
    outcome: MatchOutcome,
    label: string,
    odds: number | null | undefined,
    isFavorite: boolean
  ) => {
    const isSelected = selectedOutcome === outcome;
    return (
      <button
        type="button"
        onClick={() => onSelectOutcome(outcome)}
        className={`relative flex-1 rounded-tile border px-2 py-3 text-center transition-all cursor-pointer ${
          isSelected
            ? "border-accent/60 bg-accent/15 shadow-[0_0_16px_-4px_rgba(107,75,255,0.6)]"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
        }`}
      >
        {isFavorite && (
          <IoStar
            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#0e111b] p-[2px] text-badge-amber
              drop-shadow-[0_0_4px_rgba(245,165,36,0.75)]"
          />
        )}
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </p>
        <p
          className={`mt-1 text-lg font-black ${isSelected ? "text-white" : "text-text-secondary"}`}
        >
          {renderOdds(outcome, odds)}
        </p>
      </button>
    );
  };

  return (
    <div className="flex items-stretch justify-center gap-2 sm:gap-3">
      {outcomeTile(
        MatchOutcome.home,
        match.teamA?.tla || "??",
        match.oddsAwin,
        !!favoriteTeam && favoriteTeam._id === match.teamA?._id
      )}
      {showDraw &&
        outcomeTile(MatchOutcome.draw, "Döntetlen", match.oddsDraw, false)}
      {outcomeTile(
        MatchOutcome.away,
        match.teamB?.tla || "??",
        match.oddsBwin,
        !!favoriteTeam && favoriteTeam._id === match.teamB?._id
      )}
    </div>
  );
};

export default MatchOutcomeSelector;
