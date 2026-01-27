import type { Bet } from "@/models/bet.type";
import UserDisplay from "@/components/UserDisplay";
import { outcomeText, potentialWinnings } from "@/utils/common";
import { MatchStatus } from "@/utils/enums";
import type { FC } from "react";
import type { Match } from "@/models/match.type";

interface MatchDetailMobileProps {
  bets: Bet[];
  match: Match;
}

const MatchDetailMobile: FC<MatchDetailMobileProps> = ({ bets, match }) => {
  const matchStatus = match.status;
  const sortByPrdeictionWinnings = (a: Bet, b: Bet) => {
    const aWinnings = potentialWinnings(a.amount, a.odds);
    const bWinnings = potentialWinnings(b.amount, b.odds);
    return bWinnings - aWinnings;
  };
  return (
    <div className="flex flex-col gap-2">
      {bets.length === 0 && (
        <div className="text-center text-gray-400 py-6 text-sm">
          {match.status === MatchStatus.finished
            ? "Erre a mérkőzésre nem fogadtak"
            : "Még nincsenek fogadások"}
        </div>
      )}
      {bets.sort(sortByPrdeictionWinnings).map((bet) => {
        const isFinished = matchStatus === MatchStatus.finished;
        return (
          <div
            key={bet._id}
            className="rounded-lg shadow bg-linear-to-br from-[#0e111b] to-[#01111f] 
            px-3 py-2 border flex flex-col gap-1 mx-3 border-[#00000070]"
          >
            <div className="flex items-center justify-between mb-0.5">
              <UserDisplay user={bet.userid!} showAvatar={true} avatarSize="sm" />
              {isFinished && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    bet.success ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {bet.success ? "Nyert" : "Vesztett"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <div className="flex-1 min-w-[90px]">
                <span className="text-gray-400">Tipp: </span>
                <span className="font-semibold text-white">{outcomeText(bet, match)}</span>
              </div>
              <div className="flex-1 min-w-[60px]">
                <span className="text-gray-400">Odds: </span>
                <span className="font-semibold text-white">{bet.odds}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              <div className="flex-1 min-w-[60px]">
                <span className="text-gray-400">Tét: </span>
                <span className="font-semibold text-white">{bet.amount}</span>
              </div>
              <div className="flex-1 min-w-[70px]">
                <span className="text-gray-400">Nyeremény: </span>
                <span className="font-semibold text-white">
                  {isFinished
                    ? bet.success
                      ? potentialWinnings(bet.amount, bet.odds)
                      : 0
                    : potentialWinnings(bet.amount, bet.odds)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchDetailMobile;
