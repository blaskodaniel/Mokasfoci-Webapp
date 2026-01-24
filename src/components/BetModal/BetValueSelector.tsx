import type { FC } from "react";

interface BetValueSelectorProps {
  betValue: number;
  onChangeBetValue: (value: React.SetStateAction<number>) => void;
  userScore: number;
}

const BetValueSelector: FC<BetValueSelectorProps> = ({ betValue, onChangeBetValue, userScore }) => {
  return (
    <div className="mt-6 flex-1 sm:flex-none">
      <label className="block text-sm font-medium mb-3 text-center">Feltett tét</label>
      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          aria-label="Csökkentés"
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl flex items-center justify-center shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onChangeBetValue((v) => Math.max(100, v - 100))}
          disabled={betValue <= 100}
        >
          –
        </button>
        <span className="text-2xl font-bold min-w-[70px] text-center bg-gray-800 rounded-lg px-4 py-2 border border-gray-600 select-none">
          {betValue} <span className="text-base font-normal text-gray-400">pont</span>
        </span>
        <button
          type="button"
          aria-label="Növelés"
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl flex items-center justify-center shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onChangeBetValue((v) => Math.min(userScore, v + 100))}
          disabled={betValue + 100 > 2000}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BetValueSelector;
