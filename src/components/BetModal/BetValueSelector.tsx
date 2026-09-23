import type { FC } from "react";

interface BetValueSelectorProps {
  betValue: number;
  onChangeBetValue: (value: React.SetStateAction<number>) => void;
  maxAllowedScore: number;
}

const BetValueSelector: FC<BetValueSelectorProps> = ({
  betValue,
  onChangeBetValue,
  maxAllowedScore,
}) => {
  return (
    <div className="mt-5">
      <label className="mb-3 block text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        Feltett tét
      </label>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Csökkentés"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full
            border border-white/10 bg-white/5 text-2xl text-white transition
            hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
          onClick={() => onChangeBetValue((v) => Math.max(200, v - 100))}
          disabled={betValue <= 200}
        >
          –
        </button>
        <span className="min-w-[120px] select-none rounded-tile border border-tile-border bg-white/5 px-5 py-2.5 text-center">
          <span className="text-2xl font-black text-white">{betValue}</span>{" "}
          <span className="text-sm font-normal text-text-muted">pont</span>
        </span>
        <button
          type="button"
          aria-label="Növelés"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full
            border border-white/10 bg-white/5 text-2xl text-white transition
            hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
          onClick={() => onChangeBetValue((v) => Math.min(maxAllowedScore, v + 100))}
          disabled={betValue + 100 > Math.min(2000, maxAllowedScore)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BetValueSelector;
