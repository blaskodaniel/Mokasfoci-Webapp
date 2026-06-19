import type { FC } from "react";
import { useToplist } from "@/hooks/api/usePlayers";
import { formatPoints } from "@/utils/common";
import { motion } from "framer-motion";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";

const TournamentEndPanel: FC = () => {
  const { data: toplist, isLoading } = useToplist();

  if (isLoading || !toplist || toplist.toplist.length < 3) return null;

  const top3 = toplist.toplist.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  const getAvatarUrl = (avatar?: string) => {
    return avatar ? `${APP_CONFIG.SERVER_URL}${avatar}` : DEFAULT_AVATAR_URL;
  };

  return (
    <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-6 sm:p-10 overflow-hidden shadow-2xl">
      {/* Background glow and effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] sm:w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/20 via-gray-900/0 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 mb-4 text-center drop-shadow-md"
        >
          Vége a Bajnokságnak!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 text-center max-w-2xl text-sm sm:text-base mb-10 leading-relaxed"
        >
          Hatalmas gratuláció a győzteseknek, és köszönjük minden résztvevőnek a játékot! Reméljük,
          jól szórakoztatok és izgalmas volt veletek együtt követni a mérkőzéseket. Íme a végső
          dobogósok:
        </motion.p>

        {/* Podium Container */}
        <div className="flex items-end justify-center gap-2 sm:gap-6 w-full max-w-3xl mt-4 sm:mt-12">
          {/* 2nd Place */}
          <div className="flex flex-col items-center w-1/3 z-20">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img
                  src={getAvatarUrl(second.avatar)}
                  alt="2nd place"
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-gray-300 object-cover bg-gray-800"
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-linear-to-b from-gray-100 to-gray-400 text-gray-900 font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg border border-gray-400">
                  2
                </div>
              </div>
              <div className="mt-4 font-semibold text-center text-sm sm:text-lg text-white truncate max-w-full px-1">
                {second.username}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">
                {formatPoints(second.data?.profitScore || 0, false)}
              </div>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 100 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full bg-linear-to-t from-gray-800 to-gray-600 rounded-t-lg mt-4 border-t-2 border-x-2 border-gray-500 shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5" />
            </motion.div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center w-1/3 z-30">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 text-4xl sm:text-6xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10"
                >
                  👑
                </motion.div>
                <img
                  src={getAvatarUrl(first.avatar)}
                  alt="1st place"
                  className="relative z-0 w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-yellow-400 object-cover shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-gray-800"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-linear-to-b from-yellow-200 to-yellow-500 text-yellow-900 font-extrabold w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg shadow-lg border border-yellow-600 z-10">
                  1
                </div>
              </div>
              <div className="mt-5 font-bold text-center text-base sm:text-xl text-yellow-400 truncate max-w-full px-1">
                {first.username}
              </div>
              <div className="text-xs sm:text-sm text-yellow-200 mt-1 font-semibold">
                {formatPoints(first.data?.profitScore || 0, false)}
              </div>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 140 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-full bg-linear-to-t from-yellow-900 to-yellow-600 rounded-t-lg mt-4 border-t-2 border-x-2 border-yellow-400 shadow-[0_-10px_40px_rgba(250,204,21,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10" />
            </motion.div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center w-1/3 z-10">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img
                  src={getAvatarUrl(third.avatar)}
                  alt="3rd place"
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-amber-600 object-cover bg-gray-800"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-linear-to-b from-amber-500 to-amber-700 text-white font-bold w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg border border-amber-800">
                  3
                </div>
              </div>
              <div className="mt-3 font-medium text-center text-xs sm:text-base text-white truncate max-w-full px-1">
                {third.username}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-1">
                {formatPoints(third.data?.profitScore || 0, false)}
              </div>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 70 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full bg-linear-to-t from-gray-800 to-amber-900 rounded-t-lg mt-4 border-t-2 border-x-2 border-amber-700 shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentEndPanel;
