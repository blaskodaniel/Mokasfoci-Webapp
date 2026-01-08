import { useToplist } from "@/hooks/api/usePlayers";
import Panel from "../Panel";
import type { User } from "@/models/user.type";
import UserDisplay from "../UserDisplay";
import { formatPoints } from "@/utils/common";
import { Link } from "react-router-dom";

const ToplistWidget = () => {
  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();
  return (
    <Panel
      title="Top 3 játékos"
      className="flex-1"
      loading={toplistLoading}
      error={toplistError?.message ? "Error loading top scorers" : undefined}
    >
      {toplist && toplist.length > 0 && (
        <div className="px-2 py-4">
          <div className="flex justify-between text-xs mb-2">
            <div className="flex gap-2">
              <div>#</div>
              <div>Játékos</div>
            </div>
            <div className="flex gap-4">
              <div>Elérhető</div>
              <div>Nyeremény</div>
            </div>
          </div>
          <hr className="my-2 border-gray-700/30" />
          <div className="space-y-3">
            {toplist.slice(0, 3).map((player: User, index: number) => (
              <div key={player._id} className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="bg-black/20 text-xs rounded-full px-1.5 py-1">{index + 1}.</div>
                  <UserDisplay
                    user={player}
                    showAvatar={true}
                    avatarSize="xs"
                    nameClassName="text-sm"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-16 text-right text-xs">
                    {formatPoints(player.data.availableScore, false)}
                  </div>
                  <div className="w-16 text-right text-xs">
                    {formatPoints(player.data.profitScore, false)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-xs text-accent-soft hover:text-accent cursor-pointer">
            <Link to="/toplista">Teljes toplista</Link>
          </div>
        </div>
      )}
    </Panel>
  );
};

export default ToplistWidget;
