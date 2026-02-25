import { APP_CONFIG } from "@/config";
import type { Bet } from "@/models/bet.type";
import type { Team } from "@/models/team.type";
import { formatNumber, getCouponStatusInfo } from "@/utils/common";
import { CouponStatus } from "@/utils/enums";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

interface ScoreBetCardProps {
  bet: Bet;
  index: number;
  hasFavoriteTeam?: Team;
  bgColor?: string;
  profit: number;
  winnings: number;
  canViewDetails: boolean;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  isLayoutReady?: boolean;
}

const ScoreBetCard = ({
  bet,
  index,
  canViewDetails,
  winnings,
  onEdit,
  onDelete,
  isLayoutReady = true,
}: ScoreBetCardProps) => {
  const statusInfo = getCouponStatusInfo(bet.status);

  const hasResult = bet.matchid?.goalA != null && bet.matchid?.goalB != null;

  const renderMatchName = () => (
    <span className="flex items-center gap-1.5 truncate">
      <span className="truncate">{bet.matchid?.teamA?.name || ""}</span>
      {hasResult ? (
        <span className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest text-gray-700 dark:text-gray-300 shrink-0">
          {bet.matchid?.goalA} - {bet.matchid?.goalB}
        </span>
      ) : (
        <span className="shrink-0">-</span>
      )}
      <span className="truncate">{bet.matchid?.teamB?.name || ""}</span>
    </span>
  );

  let stripClasses = "bg-amber-500 text-white";
  let statusText = "Várható";
  let bottomValue = `+${formatNumber(winnings)}`;

  if (bet.status === CouponStatus.closed) {
    if (bet.success) {
      stripClasses = "bg-emerald-500 text-white";
      statusText = "Nyert";
    } else {
      stripClasses = "bg-rose-500 text-white";
      statusText = "Vesztett";
      bottomValue = "0";
    }
  }

  return (
    <motion.div
      layout={isLayoutReady ? true : false}
      initial={{ y: 1, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { delay: index * 0.05, duration: 0.2, ease: "easeInOut" },
      }}
      exit={{ opacity: 0 }}
      key={bet._id}
      className="group flex w-full rounded-lg overflow-hidden 
      shadow-sm bg-white dark:bg-[#1a1c23] border border-gray-200 
      dark:border-gray-800 hover:shadow-md transition-all relative min-h-[100px]"
    >
      {/* Left Content */}
      <div className="flex flex-col flex-1 relative pl-3 pr-2 py-1.5">
        {/* Badge */}
        <div className="absolute top-0 right-0">
          <span
            className={`text-[10px] px-2 py-2 rounded-bl-lg uppercase font-bold 
                tracking-wider`}
          >
            {statusInfo.text}
          </span>
        </div>

        {/* Top: Date */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 italic">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {bet.date ? format(new Date(bet.date), "MMM.dd") : ""}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {bet.date ? format(new Date(bet.date), "HH:mm") : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Teams & Score */}
        <div className="flex flex-2 items-center justify-between">
          <div
            className="font-bold text-gray-800 dark:text-gray-100 uppercase 
          tracking-tight text-base sm:text-lg flex items-center"
          >
            {/* <span>{bet.matchid?.teamA?.tla || bet.matchid?.teamA?.name}</span> */}
            <img
              src={`${APP_CONFIG.FLAG_PATH}${bet.matchid?.teamA?.flag}`}
              alt="Flag"
              className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
            />
            <span className="mx-2 text-xl font-black text-amber-500">
              {bet.scoreTeamA} - {bet.scoreTeamB}
            </span>
            {/* <span>{bet.matchid?.teamB?.tla || bet.matchid?.teamB?.name}</span> */}
            <img
              src={`${APP_CONFIG.FLAG_PATH}${bet.matchid?.teamB?.flag}`}
              alt="Flag"
              className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
            />
          </div>

          {bet.status === CouponStatus.closed && (
            <div className="flex flex-col items-end">
              <span className="text-amber-500 text-lg font-black">x{bet.odds?.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Bottom*/}
        <div className="flex flex-1 items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[85%]">
            {canViewDetails ? (
              <Link
                to={`/merkozesek/${bet.matchid?._id}`}
                className="hover:text-amber-500 transition-colors font-medium relative hover:underline underline-offset-2 flex items-center"
              >
                {renderMatchName()}
              </Link>
            ) : (
              <span className="font-medium flex items-center">{renderMatchName()}</span>
            )}
          </div>
          {bet.status === CouponStatus.active && (
            <div className="flex items-center gap-3">
              <button onClick={() => onEdit(bet)} className="text-white " title="Módosítás">
                <MdEdit size={16} />
              </button>
              <button onClick={() => onDelete(bet)} className="text-gray-400 " title="Törlés">
                <IoTrashOutline size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Perforated separator */}
      <div className="w-0 flex items-center relative h-full">
        <div
          className="absolute left-[-2px] h-[calc(100%-16px)] w-px border-l-2 
        border-dashed border-gray-100 dark:border-[#1a1c23] 
        z-20 mix-blend-overlay opacity-50"
        />
      </div>

      {/* Right Ticket Strip */}
      <div
        className={`w-[110px] sm:w-[130px] shrink-0 flex flex-col justify-between py-2.5 
          px-3 ${stripClasses} relative`}
      >
        {/* Barcode effect */}
        <div
          className="absolute right-1.5 top-2 bottom-2 w-[3px] flex flex-col items-center 
        justify-between opacity-30 select-none"
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-full bg-white rounded-sm ${i % 3 === 0 ? "h-2 w-1.5" : "h-1 w-1"}`}
            />
          ))}
        </div>

        <div className="z-10 w-full pl-0.5 mt-0.5">
          <div
            className="text-[10px] uppercase opacity-90 leading-tight font-bold 
          tracking-wider mb-0.5 drop-shadow-sm"
          >
            Tét
          </div>
          <div className="text-sm font-black leading-none drop-shadow-sm">
            {formatNumber(bet.amount)}
          </div>
        </div>

        {bet.status === CouponStatus.closed && (
          <>
            <div className="z-10 w-full flex-1 flex items-center justify-start pl-0.5 my-1">
              <span className="text-xl sm:text-2xl font-black tracking-tighter drop-shadow-md">
                {statusText}
              </span>
            </div>

            <div className="z-10 w-full pl-0.5 flex flex-col justify-end pb-0.5">
              <div className="text-sm sm:text-base font-black truncate drop-shadow-sm w-[90%] tracking-tight">
                {bottomValue}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ScoreBetCard;
