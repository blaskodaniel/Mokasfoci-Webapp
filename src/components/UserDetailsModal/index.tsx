import { useMemo, useState, type FC } from "react";
import type { UserDetailsModalProps } from "./types";
import Modal from "../Modal";
import { useGetPlayerDetails, useWinLostStats } from "@/hooks/api/usePlayers";
import { useBadgesByUser } from "@/hooks/api/useBadges";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";
import { formatPoints } from "@/utils/common";
import Loader from "../Loader";
import BalanceHistoryChart from "../Charts/BalanceHistoryChart";
import InfoTooltip from "../InfoTooltip";
import HelpModal from "../HelpModal";
import { FaMedal } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BadgeCard } from "@/pages/MyBadges";

const UserDetailsModal: FC<UserDetailsModalProps> = ({ isOpen, onClose, userId }) => {
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const { data: playerData, isLoading, error } = useGetPlayerDetails(userId);
  const { data: winLostData } = useWinLostStats(userId);
  const { data: badgesData } = useBadgesByUser(userId);
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
    <Modal isOpen={isOpen} onClose={onClose} className="sm:w-[1200px] bg-primary px-2 py-3 sm:mx-3">
      <div
        className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none overflow-y-auto 
      max-h-[calc(100vh-1rem)] scrollbar-hide"
      >
        {/* Loading and Error States */}
        {isLoading && <Loader text="Játékos adatlap betöltése..." />}

        {error && <p>Error loading player details.</p>}

        {/* Avatar and Stats Section */}
        <div className="mb-8 px-4">
          <div className="flex items-center">
            <div
              className="relative w-15 h-15 sm:w-23 sm:h-23 rounded-full shadow-lg shrink-0 cursor-pointer"
              onClick={() => setIsAvatarPreviewOpen(true)}
            >
              <img
                src={userAvatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover hover:opacity-80 transition-opacity"
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
              {playerDetails?.data.winteamid && (
                <p className="text-xs mt-0">{playerDetails?.username}</p>
              )}

              {badgesData && (
                badgesData.badges.length > 0 ? (
                  <div
                    className="inline-flex items-center gap-2 mt-2 cursor-pointer hover:text-amber-400 transition-colors text-amber-500 font-semibold max-w-max"
                    onClick={() => setIsBadgesModalOpen(true)}
                  >
                    <FaMedal size={20} />
                    <span className="text-sm underline underline-offset-2">
                      {badgesData.badges.length} jelvény
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 mt-2 text-gray-500">
                    <FaMedal size={18} />
                    <span className="text-sm italic">még nem szerzett jelvényt</span>
                  </div>
                )
              )}
              <div></div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-3 mt-6">
            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
              flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text="Átlagosan mennyi pontot tesz fel a játékos egy mérkőzésre"
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">Átlagos tét</div>
                <div className="text-white text-lg font-bold">
                  {formatPoints(playerStats?.averageBetAmount || 0, false)}
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 flex 
            flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text={`Nyertes tippek aránya ${winLostData?.won}/${(winLostData?.won || 0) + (winLostData?.lost || 0)}`}
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">
                  Találati arány
                </div>
                <div
                  className={`text-lg font-bold ${(winLostData?.winRatePercentage || 0) >= 50 ? "text-green-400" : "text-yellow-400"}`}
                >
                  {winLostData?.winRatePercentage}%
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">
                  Tippek (Nyert/Össz)
                </div>
                <div className="text-white text-lg font-bold">
                  <span className="text-green-400">{winLostData?.won || 0}</span> /{" "}
                  {(winLostData?.won || 0) + (winLostData?.lost || 0)}
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">
                  Legnagyobb nyeremény
                </div>
                <div className="text-yellow-400 text-lg font-bold">
                  {formatPoints(playerStats?.biggestWin || 0, false)}
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text="Átlagban mekkora odds-ra fogad"
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">Átlagos Odds</div>
                <div className="text-lg font-bold text-white">{playerStats?.riskLevel || "-"}</div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text="A nyeremény és a feltett tétek aránya. Megmutatja, hogy a játékos mennyire fogad hatékonyan"
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">
                  Megtérülési ráta
                </div>
                <div
                  className={`text-lg font-bold ${(playerStats?.roi || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {(playerStats?.roi || 0).toFixed(1)}%
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text="Egymást követő nyertes napok amit maximum elért a játékos egyhuzamban."
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">Nyerő széria</div>
                <div className="text-blue-400 text-lg font-bold">
                  {playerStats?.winningStreak || 0}{" "}
                  <span className="text-sm font-normal text-gray-400">nap</span>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 
            flex flex-col justify-between relative z-1 hover:z-50 focus-within:z-50"
            >
              <InfoTooltip
                text="Aktuálisan elérhető felhasználható egyenlege"
                className="absolute top-2 right-2"
              />
              <div>
                <div className="text-gray-400 text-xs font-medium mb-1 uppercase">Összpontszám</div>
                <div className="text-white text-lg font-bold">
                  {formatPoints(playerDetails?.data.availableScore || 0, false)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mt-6 mb-1 text-gray-400 text-sm uppercase tracking-wider font-medium">
              Bajnok csapat tipp
            </div>
            {playerDetails?.data.winteamid ? (
              <p className="text-sm mt-0 font-medium">{playerDetails?.data.winteamid?.name}</p>
            ) : (
              <p className="text-xs italic mt-0">Nem adott le bajnok csapat tippet</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {playerDetails?._id && (
              <div className="flex-1">
                <div className="mt-6 mb-2 text-gray-400 text-sm uppercase tracking-wider font-medium">
                  Egyenleg történet
                </div>
                <BalanceHistoryChart
                  userId={playerDetails?._id}
                  height={200}
                  showXAxis={false}
                  showYAxis={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isAvatarPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsAvatarPreviewOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsAvatarPreviewOpen(false)}
            aria-label="Bezárás"
          >
            <IoClose size={32} />
          </button>
          <img
            src={userAvatarUrl}
            alt="Avatar"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <HelpModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        title={"Jelvények"}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {badgesData?.badges?.map((badge) => {
            return (
              <BadgeCard
                key={badge._id}
                type={badge.type}
                userBadge={badge}
                hasBadge={true}
                size="sm"
              />
            );
          })}
        </div>
      </HelpModal>
    </Modal>
  );
};

export default UserDetailsModal;
