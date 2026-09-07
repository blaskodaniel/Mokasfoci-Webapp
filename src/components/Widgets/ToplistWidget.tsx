import { useToplist } from "@/hooks/api/usePlayers";
import Tile from "../ui/Tile";
import type { User } from "@/models/user.type";
import UserDisplay from "../UserDisplay";
import { formatPoints } from "@/utils/common";
import { Link } from "react-router-dom";
import { getToplistCrownIcon } from "../Toplist/getToplistCrownIcon";
import UserDetailsModal from "../UserDetailsModal";
import { useState } from "react";
import { IoTrophyOutline } from "react-icons/io5";

const ToplistWidget = ({ showHeader = true }) => {
  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  return (
    <>
      <Tile
        title="Top 3 játékos"
        titleIcon={<IoTrophyOutline />}
        accent="amber"
        className="flex-1"
        loading={toplistLoading}
        error={toplistError?.message ? "Error loading top scorers" : undefined}
      >
        {toplist && toplist.toplist.length > 0 && (
          <div className="px-3 pb-4">
            {showHeader && (
              <>
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <div className="flex gap-2">
                    <div>#</div>
                    <div>Játékos</div>
                  </div>
                  <div className="flex gap-4">
                    <div>Nyeremény</div>
                  </div>
                </div>
                <hr className="my-2 border-tile-border" />
              </>
            )}

            <div className="space-y-1.5">
              {toplist.toplist.slice(0, 3).map((player: User, index: number) => {
                const positionIcon = getToplistCrownIcon(index, 15);
                return (
                  <div
                    key={player._id}
                    className="flex justify-between items-center rounded-lg px-1.5 py-1.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="bg-black/20 text-xs rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                        {positionIcon}
                      </div>
                      <UserDisplay
                        user={player}
                        showAvatar={true}
                        avatarSize="xs"
                        nameClassName="text-sm"
                        onClick={() => {
                          setSelectedUserId(player._id);
                          setIsUserDetailsModalOpen(true);
                        }}
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 text-center text-xs font-bold text-badge-success">
                        {formatPoints(player.data.profitScore, false)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-center text-xs text-accent-soft hover:text-highlight transition-colors cursor-pointer">
              <Link to="/ranglista">Teljes ranglista →</Link>
            </div>
          </div>
        )}
      </Tile>
      {selectedUserId && (
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          onClose={() => setIsUserDetailsModalOpen(false)}
          userId={selectedUserId}
        />
      )}
    </>
  );
};

export default ToplistWidget;
