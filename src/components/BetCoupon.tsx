import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { outcomeText, potentialWinnings } from "@/utils/common";

interface BetCouponProps {
  bet: Bet;
  match: Match;
}

const BetCouponBox = ({ bet, match }: BetCouponProps) => {
  return (
    <div className="bg-linear-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/40 rounded-lg p-3 shadow-lg backdrop-blur-sm">
      {/* Jegy header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
          Fogadási Jegy
        </span>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      {/* Kimenetel */}
      <div className="bg-black/20 rounded px-2 py-1 mb-2">
        <span className="text-sm font-medium text-white">
          {outcomeText(bet, match)}
        </span>
      </div>

      {/* Tét és nyeremény */}
      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-xs text-gray-400">Tét</p>
          <p className="text-sm font-semibold text-yellow-400">
            {bet.amount} pont
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Nyeremény</p>
          <p className="text-sm font-semibold text-green-400">
            {potentialWinnings(bet.amount, bet.odds)} pont
          </p>
        </div>
      </div>

      {/* Odds */}
      <div className="mt-2 pt-2 border-t border-gray-600/30">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Odds:</span>
          <span className="text-xs font-mono text-blue-300">{bet.odds}</span>
        </div>
      </div>
    </div>
  );
};

export default BetCouponBox;
