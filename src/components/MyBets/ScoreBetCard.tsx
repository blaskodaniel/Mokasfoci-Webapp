import type { Bet } from "@/models/bet.type";
import type { Team } from "@/models/team.type";
import { formatNumber, getCouponStatusInfo } from "@/utils/common";
import { motion } from "framer-motion";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit, MdFavorite } from "react-icons/md";
import { Link } from "react-router-dom";

interface ScoreBetCardProps {
  bet: Bet;
  index: number;
  hasFavoriteTeam?: Team;
  bgColor?: string;
  canViewDetails: boolean;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
}

const ScoreBetCard = ({
  bet,
  index,
  hasFavoriteTeam,
  bgColor,
  canViewDetails,
  onEdit,
  onDelete,
}: ScoreBetCardProps) => {
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
          <span className="text-white font-semibold text-md">
            {bet.matchid?.teamA?.tla} {bet.scoreTeamA} : {bet.scoreTeamB} {bet.matchid?.teamB?.tla}
          </span>
        </div>
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
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <span className="text-gray-400 text-xs">Tét</span>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium">
                  {formatNumber(bet.amount)} pont
                </span>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreBetCard;
