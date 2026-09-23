import { motion } from "framer-motion";
import { IoTrophyOutline } from "react-icons/io5";
import UserDisplay from "../UserDisplay";
import { formatNumber, getWinRatePercent } from "@/utils/common";
import { getToplistCrownIcon } from "./getToplistCrownIcon";
import type { ToplistRow } from "./types";

interface ToplistHighlightsProps {
  users: ToplistRow[];
  primaryLabel: string;
  secondaryLabel: string;
  onSelect: (userId: string) => void;
}

const rankStyles = [
  {
    border: "border-badge-amber/50",
    glow: "shadow-[0_0_20px_-6px_rgba(245,165,36,0.55)]",
    wash: "bg-badge-amber/[0.07]",
    value: "text-badge-amber",
  },
  {
    border: "border-white/15",
    glow: "",
    wash: "bg-white/[0.03]",
    value: "text-text-primary",
  },
  {
    border: "border-[#cd7f32]/40",
    glow: "",
    wash: "bg-[#cd7f32]/[0.06]",
    value: "text-[#e0a370]",
  },
];

const ToplistHighlights = ({
  users,
  primaryLabel,
  secondaryLabel,
  onSelect,
}: ToplistHighlightsProps) => {
  const leaders = users.slice(0, 3);

  if (leaders.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] shadow-tile">
      <div className="flex items-center gap-2 border-b border-tile-border bg-white/[0.03] px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-full border border-badge-amber-border bg-badge-amber-bg text-badge-amber">
          <IoTrophyOutline size={15} />
        </span>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
          Élmezőny
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-3">
        {leaders.map((user, index) => {
          const style = rankStyles[index];
          const winRate = getWinRatePercent(user.wins, user.losses);

          return (
            <motion.button
              key={user.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(user.id)}
              className={`flex items-center gap-2.5 rounded-xl border ${style.border} ${style.wash} ${style.glow} p-2.5 text-left transition-colors hover:brightness-110`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center">
                {getToplistCrownIcon(index, 26)}
              </span>

              <UserDisplay
                user={{
                  _id: user.id,
                  avatar: user.avatar,
                  name: user.name,
                  username: user.username,
                }}
                showUsername={false}
                avatarSize="sm"
              />

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-text-primary">
                  {user.name || user.username}
                </div>
                <div className="truncate text-[10px] text-text-muted">
                  {formatNumber(user.secondary)} {secondaryLabel}
                </div>
                <div className="truncate text-[10px] text-text-muted/80">
                  {user.betCount ?? 0} fogadás{winRate !== null && ` · ${winRate}% találat`}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className={`text-base font-black tabular-nums ${style.value}`}>
                  {formatNumber(user.primary)}
                </div>
                <div className="text-[10px] font-semibold text-text-muted">{primaryLabel}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default ToplistHighlights;
