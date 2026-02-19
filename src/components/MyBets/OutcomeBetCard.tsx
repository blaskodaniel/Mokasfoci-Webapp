import { APP_CONFIG } from "@/config";
import { useConfig } from "@/hooks/useConfig";
import type { Bet } from "@/models/bet.type";
import type { Team } from "@/models/team.type";
import { formatNumber, getCouponStatusInfo } from "@/utils/common";
import { CouponStatus } from "@/utils/enums";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit, MdFavorite, MdOutlinePriceCheck } from "react-icons/md";
import { Link } from "react-router-dom";

interface OutcomeBetCardProps {
  bet: Bet;
  index: number;
  outcomeFlag?: string | null;
  outcomeText?: string;
  hasFavoriteTeam?: Team;
  bgColor?: string;
  canViewDetails: boolean;
  shouldShowPotentialWinnings: boolean;
  winnings: number;
  profit: number;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
}

const OutcomeBetCard = ({
  bet,
  index,
  outcomeFlag,
  outcomeText,
  hasFavoriteTeam,
  bgColor,
  canViewDetails,
  shouldShowPotentialWinnings,
  winnings,
  profit,
  onEdit,
  onDelete,
}: OutcomeBetCardProps) => {
  const { config } = useConfig();
  const statusInfo = getCouponStatusInfo(bet.status);
  const matchName = `${bet.matchid?.teamA?.name || ""} - ${bet.matchid?.teamB?.name || ""}`;
  return (
    <motion.div
      layout
      initial={{ y: 1, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          delay: index * 0.05,
          type: "spring",
          damping: 30,
          stiffness: 500,
        },
      }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{
        layout: {
          type: "spring",
          damping: 50,
          stiffness: 500,
        },
      }}
      key={bet._id}
      className={`${bgColor} border border-primary/20 rounded-lg overflow-hidden 
            shadow-md hover:border-accent/30 transition-colors`}
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
        {hasFavoriteTeam ? (
          <div>
            <span className="text-amber-500 text-md font-bold">x{bet.odds.toFixed(2)}</span>
            <span className="text-green-500 text-md font-bold"> x{config?.favoritTeamFactor}</span>
          </div>
        ) : (
          <span className="text-amber-500 text-md font-bold">x{bet.odds?.toFixed(2)}</span>
        )}
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
              <div className="flex gap-1">
                {matchName}
                {hasFavoriteTeam && <MdFavorite color="red" />}
              </div>
            </Link>
          ) : (
            <span className="text-white text-sm font-medium">
              <div className="flex gap-1">
                {matchName}
                {hasFavoriteTeam && <MdFavorite color="red" />}
              </div>
            </span>
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
                {shouldShowPotentialWinnings ? formatNumber(winnings) : 0}
              </div>
              <div className="text-gray-400 text-xs">
                {bet.status === CouponStatus.active ? "Várható nyeremény" : "Nyeremény"}
              </div>
            </div>
          </div>
        </div>

        {/* Result and date footer */}
        <div className="flex justify-between items-center  mb-2">
          <span className="text-gray-500 text-xs">
            {bet.date && format(new Date(bet.date), "MMM dd HH:mm")}
          </span>
          {bet.status === CouponStatus.active && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(bet)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                title="Módosítás"
              >
                <MdEdit className="text-gray-400 hover:text-blue-400" />
              </button>
              <button
                onClick={() => onDelete(bet)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                title="Törlés"
              >
                <IoTrashOutline className="text-gray-400 hover:text-red-400" />
              </button>
            </div>
          )}
          {bet.status === CouponStatus.closed && (
            <div>
              {bet.success === true ? (
                <div className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                  Nyert <MdOutlinePriceCheck size={16} />
                </div>
              ) : (
                <span className="text-red-400 font-semibold text-xs">Vesztett</span>
              )}
            </div>
          )}
          {profit > 0 && (
            <span className="text-green-600 font-semibold text-xs">
              +{formatNumber(profit)} profit
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OutcomeBetCard;
