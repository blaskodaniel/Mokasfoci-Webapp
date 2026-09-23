import type { Match } from "@/models/match.type";
import type { FC } from "react";

interface ScoreInputSelectorProps {
  match: Match;
  homeScore: number | "";
  awayScore: number | "";
  onScoreChange: (home: number | "", away: number | "") => void;
}

const ScoreInputSelector: FC<ScoreInputSelectorProps> = ({
  match,
  homeScore,
  awayScore,
  onScoreChange,
}) => {
  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (value === "" || (!isNaN(value) && value >= 0 && value < 100)) {
      onScoreChange(value, awayScore);
    }
  };

  const handleAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (value === "" || (!isNaN(value) && value >= 0 && value < 100)) {
      onScoreChange(homeScore, value);
    }
  };

  const inputClass =
    "w-16 h-14 sm:w-20 sm:h-16 text-center text-3xl font-black text-white bg-white/5 " +
    "rounded-tile border border-tile-border focus:border-accent focus:ring-2 focus:ring-accent/30 " +
    "focus:outline-none transition-colors [appearance:textfield] " +
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="flex flex-col items-center gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {match.teamA?.tla || "Hazai"}
        </label>
        <input
          type="number"
          value={homeScore}
          onChange={handleHomeChange}
          className={inputClass}
          placeholder="0"
          min="0"
          max="99"
        />
      </div>

      <span className="mt-6 text-2xl font-bold text-text-muted">-</span>

      <div className="flex flex-col items-center gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {match.teamB?.tla || "Vendég"}
        </label>
        <input
          type="number"
          value={awayScore}
          onChange={handleAwayChange}
          className={inputClass}
          placeholder="0"
          min="0"
          max="99"
        />
      </div>
    </div>
  );
};

export default ScoreInputSelector;
