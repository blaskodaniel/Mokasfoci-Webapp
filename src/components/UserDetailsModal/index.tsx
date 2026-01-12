import { useMemo, type FC } from "react";
import type { UserDetailsModalProps } from "./types";
import Modal from "../Modal";
import { useGetPlayerDetails } from "@/hooks/api/usePlayers";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";
import { formatPoints } from "@/utils/common";
import Loader from "../Loader";
import BalanceHistoryChart from "../Charts/BalanceHistoryChart";
import WinLostChart from "../Charts/WinLostChart";

const UserDetailsModal: FC<UserDetailsModalProps> = ({ isOpen, onClose, userId }) => {
  const { data: playerData, isLoading, error } = useGetPlayerDetails(userId);
  const playerDetails = playerData?.details;
  const playerStats = playerData?.stats;

  const userAvatarUrl = useMemo(
    () =>
      playerDetails?.avatar
        ? `${APP_CONFIG.SERVER_URL}${playerDetails.avatar}`
        : DEFAULT_AVATAR_URL,
    [playerDetails?.avatar]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="sm:w-[1200px] bg-quaternary px-4 py-3 sm:mx-3"
    >
      <div className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none overflow-y-auto max-h-[calc(100vh-1rem)]">
        {/* Loading and Error States */}
        {isLoading && <Loader text="Játékos adatlap betöltése..." />}

        {error && <p>Error loading player details.</p>}

        {/* Avatar and Stats Section */}
        <div className="mb-8 px-4">
          <div className="flex items-center">
            <div className="relative w-15 h-15 sm:w-23 sm:h-23 rounded-full shadow-lg shrink-0">
              <img
                src={userAvatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
              {playerData?.details.data.teamid && (
                <img
                  src={`${APP_CONFIG.FLAG_PATH}${playerData?.details.data.teamid?.flag}`}
                  alt={`${playerData?.details.data.teamid?.name} flag`}
                  className="absolute w-5 h-5 sm:w-7 sm:h-7 object-cover rounded-full -top-1 right-0 border-2 border-quaternary"
                />
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col justify-center ml-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {playerDetails?.name || playerDetails?.username}
              </h2>
              <p className="text-gray-400 text-xs">{playerDetails?.email}</p>
              {playerDetails?.data.winteamid && (
                <p className="text-sm mt-1">
                  Bajnok csapat tipp: {playerDetails?.data.winteamid?.name}
                </p>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 mt-6">
            <div
              className="bg-gray-900/50 backdrop-blur-sm
                    rounded-xl px-3 py-2 sm:p-4 border border-gray-700/50"
            >
              <div className="text-green-400 text-sm font-medium mb-1">Felhasználható</div>
              <div className="text-white text-xl font-bold">
                {formatPoints(playerDetails?.data.availableScore || 0, false)}{" "}
                <span className="text-xs">pont</span>
              </div>
            </div>
            <div
              className="bg-gray-900/50 backdrop-blur-sm
                    rounded-xl px-3 py-2 sm:p-4 border border-gray-700/50"
            >
              <div className="text-yellow-400 text-sm font-medium mb-1">Nyeremény</div>
              <div className="text-white text-xl font-bold">
                {formatPoints(playerDetails?.data.profitScore || 0, false)}{" "}
                <span className="text-xs">pont</span>
              </div>
            </div>
            <div
              className="bg-gray-900/50 backdrop-blur-sm
                    rounded-xl px-3 py-2 sm:p-4 border border-gray-700/50 col-span-2 sm:col-span-1"
            >
              <div className="text-yellow-400 text-sm font-medium mb-1">Átlagosan feltett tét</div>
              <div className="text-white text-xl font-bold">
                {formatPoints(playerStats?.averageBetAmount || 0, false)}{" "}
                <span className="text-xs">pont</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-8">
            {playerDetails?._id && (
              <>
                <div className="flex-1">
                  <BalanceHistoryChart userId={playerDetails?._id} />
                </div>
                <div className="flex-1">
                  <WinLostChart userId={playerDetails?._id} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
