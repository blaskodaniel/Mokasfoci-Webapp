import { useToplist } from "@/hooks/api/usePlayers";
import Panel from "../Panel";
import type { User } from "@/models/user.type";
import UserDisplay from "../UserDisplay";
import { formatPoints } from "@/utils/common";
import { Link } from "react-router-dom";
import { getToplistCrownIcon } from "../Toplist/getToplistCrownIcon";
import UserDetailsModal from "../UserDetailsModal";
import { useState } from "react";

const ToplistWidget = ({ showHeader = true }) => {
  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  return (
    <>
      <Panel
        title="Top 3 játékos"
        className="flex-1"
        loading={toplistLoading}
        error={toplistError?.message ? "Error loading top scorers" : undefined}
      >
        {toplist && toplist.toplist.length > 0 && (
          <div className="px-2 py-4">
            {showHeader && (
              <>
                <div className="flex justify-between text-xs mb-2">
                  <div className="flex gap-2">
                    <div>#</div>
                    <div>Játékos</div>
                  </div>
                  <div className="flex gap-4">
                    <div>Nyeremény</div>
                  </div>
                </div>
                <hr className="my-2 border-gray-700/30" />
              </>
            )}

            <div className="space-y-3">
              {toplist.toplist.slice(0, 3).map((player: User, index: number) => {
                const positionIcon = getToplistCrownIcon(index, 15);
                return (
                  <div key={player._id} className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="bg-black/20 text-xs rounded-full px-1.5 py-1">
                        {positionIcon}
                      </div>
                      <UserDisplay
                        user={player}
                        showAvatar={true}
                        avatarSize="xs"
                        nameClassName="text-sm underline"
                        onClick={() => {
                          setSelectedUserId(player._id);
                          setIsUserDetailsModalOpen(true);
                        }}
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 text-center text-xs">
                        {formatPoints(player.data.profitScore, false)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center text-xs text-accent-soft hover:text-accent cursor-pointer underline">
              <Link to="/ranglista">Teljes ranglista</Link>
            </div>
          </div>
        )}
      </Panel>
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
