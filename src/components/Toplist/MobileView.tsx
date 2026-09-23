import type { FC } from "react";
import type { ToplistProps } from "./types";
import Loader from "../Loader";
import UserDisplay from "../UserDisplay";
import { formatNumber, getWinRatePercent } from "@/utils/common";

const ToplistMobileView: FC<ToplistProps> = ({
  users,
  primaryLabel = "pont",
  secondaryLabel = "pont",
  startPosition = 1,
  loading,
  error,
  onSelect,
}) => {
  if (loading) {
    return <Loader text="Lista betöltése..." />;
  }

  if (error) {
    return (
      <div className="rounded-tile border border-badge-live-border bg-badge-live-bg px-4 py-5 text-center text-sm text-badge-live">
        Valami hiba történt a ranglista betöltése során.
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] shadow-tile">
      <div className="border-b border-tile-border bg-white/[0.03] px-4 py-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
          Teljes rangsor
        </h2>
      </div>
      <div className="divide-y divide-tile-border">
        {users.map((user, index) => {
          const winRate = getWinRatePercent(user.wins, user.losses);
          return (
            <button
              key={user.id}
              type="button"
              className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-white/[0.04]"
              onClick={() => onSelect?.(user.id)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-6 shrink-0 text-center text-xs font-black tabular-nums text-text-muted">
                  {String(startPosition + index).padStart(2, "0")}
                </span>
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
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text-secondary">
                    {user.name || user.username}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-text-muted">
                    {formatNumber(user.secondary)} {secondaryLabel}
                  </div>
                  <div className="truncate text-[10px] text-text-muted/80">
                    {user.betCount ?? 0} fogadás{winRate !== null && ` · ${winRate}% találat`}
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-black tabular-nums text-badge-success">
                  {formatNumber(user.primary)}
                </div>
                <div className="text-[10px] text-text-muted">{primaryLabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ToplistMobileView;
