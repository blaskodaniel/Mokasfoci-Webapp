import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdEdit, MdOutlinePriceCheck } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import type { Bet } from "@/models/bet.type";
import { getCouponStatusInfo, potentialWinnings } from "@/utils/common";
import { CouponStatus, MatchOutcome, MatchStatus } from "@/utils/enums";
import { APP_CONFIG } from "@/config";

interface MyBetsMobileViewProps {
  bets: Bet[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
}

const MyBetsMobileView = ({ bets, onEdit, onDelete }: MyBetsMobileViewProps) => {
  if (!bets || bets.length === 0) {
    return <div className="text-center text-gray-400 py-8">Még nincsenek fogadásaid</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {bets.map((bet) => {
        const canViewDetails = bet.matchid?.status !== MatchStatus.enabled;
        const matchName = `${bet.matchid?.teamA?.name || ""} - ${bet.matchid?.teamB?.name || ""}`;
        const statusInfo = getCouponStatusInfo(bet.status);
        const shouldShowPotentialWinnings =
          bet.status === CouponStatus.active || (bet.status === CouponStatus.closed && bet.success);
        const winnings = potentialWinnings(bet.amount, bet.odds);
        const profit =
          bet.status === CouponStatus.closed && bet.success ? winnings - bet.amount : 0;
        const bgColor =
          bet.status === CouponStatus.active
            ? "bg-panel-bg"
            : bet.status === CouponStatus.closed && bet.success
              ? "bg-green-900/20"
              : "bg-red-900/20";

        const outcomeText =
          bet.outcome === MatchOutcome.home
            ? bet?.matchid?.teamA?.name
            : bet.outcome === MatchOutcome.away
              ? bet?.matchid?.teamB?.name
              : "Döntetlen";

        const outcomeFlag =
          bet.outcome === MatchOutcome.home
            ? bet?.matchid?.teamA?.flag
            : bet.outcome === MatchOutcome.away
              ? bet?.matchid?.teamB?.flag
              : null;

        return (
          <div
            key={bet._id}
            className={`${bgColor} border border-primary/20 rounded-lg overflow-hidden 
            shadow-md hover:border-accent/30 transition-all`}
          >
            {/* Header with outcome team/result */}
            <div className="bg-panel-header-bg px-3 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {outcomeFlag && (
                  <img
                    src={`${APP_CONFIG.FLAG_PATH}${outcomeFlag}`}
                    alt="Team A Flag"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span className="text-white font-semibold text-md">{outcomeText}</span>
              </div>
              <span className="text-amber-500 text-md font-bold">x{bet.odds}</span>
            </div>

            {/* Match Result label and status */}
            <div className="px-3 pt-2 pb-1">
              <div className="flex items-center justify-between mb-0">
                <span className="text-gray-400 text-xs">Mérkőzés</span>
                <span
                  className={`${statusInfo.color} px-2 py-0.5 rounded text-xs ${statusInfo.className}`}
                >
                  {statusInfo.text}
                </span>
              </div>

              {/* Match name with flags */}
              <div className="mb-2">
                {canViewDetails ? (
                  <Link
                    to={`/merkozesek/${bet.matchid?._id}`}
                    className="text-white hover:text-amber-400 text-sm font-medium"
                  >
                    {matchName}
                  </Link>
                ) : (
                  <span className="text-white text-sm font-medium">{matchName}</span>
                )}
              </div>

              {/* Bet amount and potential winnings in a box */}
              <div className="rounded mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-white font-bold text-xl">{bet.amount}</div>
                    <div className="text-gray-400 text-xs">Tét</div>
                  </div>
                  <div className="h-8 w-px bg-gray-700"></div>
                  <div className="flex-1 text-right">
                    <div
                      className={`font-bold text-xl ${shouldShowPotentialWinnings ? "text-green-400" : "text-gray-400"}`}
                    >
                      {shouldShowPotentialWinnings ? winnings : 0}
                    </div>
                    <div className="text-gray-400 text-xs">Nyeremény</div>
                  </div>
                </div>
              </div>

              {/* Result and date footer */}
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-500">
                  {bet.date && format(new Date(bet.date), "MMM dd HH:mm")}
                </span>
                {bet.status === CouponStatus.closed && (
                  <div>
                    {bet.success === true ? (
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        Nyert <MdOutlinePriceCheck size={16} />
                      </div>
                    ) : (
                      <span className="text-red-400 font-semibold">Vesztett</span>
                    )}
                  </div>
                )}
                {profit > 0 && (
                  <span className="text-green-600 font-semibold">+{profit} Ft profit</span>
                )}
              </div>
            </div>

            {/* Actions */}
            {bet.status === CouponStatus.active && (
              <div className="flex border-t border-gray-700/40">
                <button
                  onClick={() => onEdit(bet)}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent/10
                   hover:bg-accent/20 text-accent-soft py-1.5 transition-colors border-r
                    border-gray-700/40"
                >
                  <MdEdit size={16} />
                  <span className="text-sm font-medium">Szerkesztés</span>
                </button>
                <button
                  onClick={() => onDelete(bet)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10
                   hover:bg-red-500/20 text-red-400 py-1.5 transition-colors"
                >
                  <IoTrashOutline size={16} />
                  <span className="text-sm font-medium">Törlés</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyBetsMobileView;
