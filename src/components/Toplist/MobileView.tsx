import type { FC } from "react";
import type { ToplistProps } from "./types";
import Loader from "../Loader";
import UserDisplay from "../UserDisplay";
import { formatNumber } from "@/utils/common";

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
    <div className="space-y-2">
      {users.map((user, i) => {
        return (
          <div
            key={user._id}
            className="flex gap-6 items-center cursor-pointer hover:bg-gray-700/10 
            transition-colors p-2 border-b border-white/10 last:border-b-0"
            onClick={() => onSelect && onSelect(user._id)}
          >
            <div className="flex items-center gap-5">
              <div className="text-gray-400 text-lg font-semibold pt-1">{i + 1}.</div>
              <UserDisplay user={user} avatarSize="md" showUsername={false} />
            </div>

            <div className="flex-1">
              <div className="font-medium mb-0">{user.username}</div>
              <div className="flex gap-4">
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatNumber(user.data.availableScore)}
                  </div>
                  <div className="text-xs text-gray-400 italic">felhasználható</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatNumber(user.data.profitScore)}
                  </div>
                  <div className="text-xs text-gray-400 italic">nyeremény</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToplistMobileView;
