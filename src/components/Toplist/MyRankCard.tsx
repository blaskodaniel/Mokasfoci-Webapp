import { IoPersonOutline } from "react-icons/io5";
import UserDisplay from "../UserDisplay";
import { formatNumber, getWinRatePercent } from "@/utils/common";
import type { ToplistRow } from "./types";

interface MyRankCardProps {
  user: ToplistRow;
  rank: number;
  primaryLabel: string;
  onSelect: (userId: string) => void;
}

const MyRankCard = ({ user, rank, primaryLabel, onSelect }: MyRankCardProps) => {
  const winRate = getWinRatePercent(user.wins, user.losses);

  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      className="flex w-full items-center gap-3 rounded-tile border border-accent/40 bg-accent/10 px-4 py-3
        text-left shadow-[0_0_18px_-8px_rgba(107,75,255,0.7)] transition-colors hover:bg-accent/15"
    >
      <span className="flex items-center gap-1.5 shrink-0 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-soft">
        <IoPersonOutline size={12} />
        Te
      </span>
      <span className="shrink-0 text-lg font-black tabular-nums text-white">#{rank}</span>

      <UserDisplay
        user={{ _id: user.id, avatar: user.avatar, name: user.name, username: user.username }}
        showUsername={false}
        avatarSize="sm"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-text-primary">
          {user.name || user.username}
        </div>
        <div className="truncate text-[11px] text-text-muted">
          {user.betCount ?? 0} fogadás{winRate !== null && ` · ${winRate}% találat`}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-base font-black tabular-nums text-accent-soft">
          {formatNumber(user.primary)}
        </div>
        <div className="text-[10px] font-semibold text-text-muted">{primaryLabel}</div>
      </div>
    </button>
  );
};

export default MyRankCard;
