import type { FC } from "react";
import type { ToplistProps } from "./types";
import Loader from "../Loader";
import UserDisplay from "../UserDisplay";
import { formatNumber } from "@/utils/common";
import { getToplistCrownIcon } from "./getToplistCrownIcon";

const ToplistMobileView: FC<ToplistProps> = ({ users, loading, error, onSelect }) => {
  if (loading) {
    return <Loader text="Lista betöltése..." />;
  }

  if (error) {
    return <p>❌ Valami hiba történt a betöltés során</p>;
  }

  if (users.length === 0) {
    return <p>ℹ️ Nincsenek játékosok </p>;
  }

  return (
    <div className="space-y-1 mt-4">
      {users.map((user, i) => {
        const positionIcon = getToplistCrownIcon(i);
        return (
          <div
            key={user._id}
            className={`flex gap-6 items-center justify-between cursor-pointer hover:bg-gray-700/10 
            transition-colors p-1 pr-2`}
            onClick={() => onSelect && onSelect(user._id)}
          >
            <div className="flex items-center gap-5 w-60">
              <div className="text-gray-400 text-lg font-semibold w-5 text-center pb-1">
                {positionIcon}
              </div>
              <UserDisplay user={user} avatarSize="sm" showUsername={false} />
              <div className="font-medium mb-0">
                <div>{user?.name || user.username}</div>
                <div className="text-xs text-gray-400">
                  {formatNumber(user.data.availableScore)} <span className="text-xs">pont</span>
                </div>
              </div>
            </div>

            <div className="text-md font-semibold text-green-400">
              {formatNumber(user.data.profitScore)} <span className="text-xs">pont</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToplistMobileView;
