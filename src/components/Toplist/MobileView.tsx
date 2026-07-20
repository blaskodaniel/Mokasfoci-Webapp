import type { FC } from "react";
import type { ToplistProps } from "./types";
import Loader from "../Loader";
import { motion } from "framer-motion";
import UserDisplay from "../UserDisplay";
import { formatNumber } from "@/utils/common";

const ToplistMobileView: FC<ToplistProps> = ({
  users,
  primaryLabel = "pont",
  secondaryLabel = "pont",
  secondaryPodiumLabel = "",
  loading,
  error,
  onSelect,
}) => {
  if (loading) {
    return <Loader text="Lista betöltése..." />;
  }

  if (error) {
    return <p>❌ Valami hiba történt a betöltés során</p>;
  }

  if (users.length === 0) {
    return <p>ℹ️ Nincsenek játékosok </p>;
  }

  // Dobogósok (top 3)
  // A dobogó vizuális sorrendje: 2. hely balra, 1. hely középen, 3. hely jobbra
  const rawPodium = users.slice(0, 3);
  const podium = [rawPodium[1], rawPodium[0], rawPodium[2]].filter(Boolean);
  const others = users.slice(3);

  // Dobogó magasságok (középső a legmagasabb)
  const heights = [110, 80, 60];
  const colors = ["bg-yellow-200", "bg-gray-200", "bg-orange-200"];
  const borderColors = ["border-yellow-400", "border-gray-400", "border-orange-400"];

  return (
    <div className="flex flex-col items-center w-full mt-10">
      {/* Dobogó */}
      <div
        className="px-2 flex items-end justify-center gap-2 w-full mb-4"
        style={{ minHeight: 140 }}
      >
        {podium.map((user, idx) => {
          // 2. hely balra, 1. hely középen, 3. hely jobbra (helyes vizuális sorrend)
          const order = [1, 0, 2];
          const i = order[idx];
          return (
            <motion.div
              key={user.id}
              initial={{ height: 0, opacity: 1 }}
              animate={{ height: heights[i], opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 60 }}
              className={`flex flex-col items-center justify-end relative 
                z-10 w-30 ${colors[i]} border-2 ${borderColors[i]} rounded-t-2xl shadow-lg`}
              // style={{ overflow: "hidden" }}
              onClick={() => onSelect && onSelect(user.id)}
            >
              <div className="absolute -top-18 flex flex-col items-center">
                <UserDisplay
                  user={{
                    _id: user.id,
                    avatar: user.avatar,
                    name: user.name,
                    username: user.username,
                  }}
                  avatarSize="md"
                  showUsername={false}
                />
                <div className="font-bold text-sm mt-1 text-center truncate w-24">
                  {user?.name || user.username}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full w-full pb-1">
                <div className="font-bold text-lg text-blue-700 flex items-center">
                  {formatNumber(user.primary)} {secondaryPodiumLabel}
                </div>
                <div className="text-[10px] leading-tight text-gray-500">
                  {formatNumber(user.secondary)} {secondaryLabel}
                </div>
                <div className="font-bold text-sm text-gray-500 mt-0">#{i + 1}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Többi játékos */}
      <div className="space-y-1 w-full">
        {others.map((user, i) => (
          <div
            key={user.id}
            className="flex gap-4 items-center justify-between cursor-pointer hover:bg-gray-700/10 transition-colors p-1 pr-2 rounded"
            onClick={() => onSelect && onSelect(user.id)}
          >
            <div className="flex items-center gap-3 ">
              <div className="text-gray-400 text-md font-semibold w-5 text-center pb-1">
                #{i + 4}
              </div>
              <UserDisplay
                user={{
                  _id: user.id,
                  avatar: user.avatar,
                  name: user.name,
                  username: user.username,
                }}
                avatarSize="sm"
                showUsername={false}
              />
              <div className="font-medium mb-0">
                <div>{user?.name || user.username}</div>
                <div className="text-xs text-gray-400">
                  {formatNumber(user.secondary)} <span className="text-xs">{secondaryLabel}</span>
                </div>
              </div>
            </div>
            <div className="text-md font-semibold text-green-400">
              {formatNumber(user.primary)} <span className="text-xs">{primaryLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToplistMobileView;
