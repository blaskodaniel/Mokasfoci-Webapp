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

  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-gray-400">{match.teamA?.tla || "Hazai"}</label>
        <input
          type="number"
          value={homeScore}
          onChange={handleHomeChange}
          className="w-16 h-12 text-center text-2xl font-bold bg-secondary 
          rounded-lg border border-gray-600 focus:border-green-500 
          focus:outline-none transition-colors [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          min="0"
          max="99"
        />
      </div>

      <span className="text-2xl font-bold text-gray-500 mt-6">-</span>

      <div className="flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-gray-400">{match.teamB?.tla || "Vendég"}</label>
        <input
          type="number"
          value={awayScore}
          onChange={handleAwayChange}
          className="w-16 h-12 text-center text-2xl font-bold bg-secondary 
          rounded-lg border border-gray-600 focus:border-green-500 
          focus:outline-none transition-colors [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          min="0"
          max="99"
        />
      </div>
    </div>
  );
};

export default ScoreInputSelector;
