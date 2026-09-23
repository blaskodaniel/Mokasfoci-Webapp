import { useClickOutside } from "@/hooks/useClickOutside";
import type { Team } from "@/models/team.type";
import { useRef, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";

const columnFieldMap = {
  LM: "playedGames",
  GY: "win",
  D: "draw",
  V: "loss",
  GK: "goalDifference",
  P: "score",
} as const;

type ColumnKey = keyof typeof columnFieldMap;

const columnTooltipMap: Record<ColumnKey, string> = {
  LM: "Lejátszott mérkőzések",
  GY: "Győzelem",
  D: "Döntetlen",
  V: "Vereség",
  GK: "Gólkülönbség",
  P: "Pontszám",
};

interface GroupStandingsProps {
  groupName: string;
  groupId: string;
  teams?: Team[];
  columns?: ColumnKey[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "modal";
}

const GroupStandings: FC<GroupStandingsProps> = ({
  groupName,
  groupId,
  teams,
  columns = Object.keys(columnFieldMap) as ColumnKey[],
  size = "md",
  variant = "default",
}) => {
  const navigate = useNavigate();
  const [activeCol, setActiveCol] = useState<ColumnKey | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  useClickOutside(headerRef, () => setActiveCol(null));

  const isModal = variant === "modal";
  const visibleColumns = columns ?? (Object.keys(columnFieldMap) as ColumnKey[]);
  const className = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <div
      className={
        isModal
          ? `w-full overflow-hidden rounded-tile border border-tile-border bg-black/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${className}`
          : `w-full rounded-xl bg-black/50 p-2 text-white shadow-lg backdrop-blur-md ${className}`
      }
    >
      <div
        className={
          isModal
            ? "flex items-center justify-between border-b border-tile-border bg-white/[0.03] px-3 py-2.5"
            : "mb-2 flex items-center justify-between rounded-xl bg-[#085225db] px-2 py-1 font-bold backdrop-blur-md"
        }
      >
        <Link
          to={`/csoportok/${groupId}`}
          className={
            isModal
              ? "truncate text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary transition-colors hover:text-accent-soft"
              : "truncate text-sm uppercase underline hover:text-blue-400"
          }
        >
          {groupName} csoport
        </Link>
        <div
          className={`flex items-center ${isModal ? "gap-2 text-[10px] font-bold text-text-muted" : "gap-4 text-sm"}`}
          ref={headerRef}
        >
          {visibleColumns.map((col) => (
            <div
              key={col}
              className="group relative w-4 cursor-pointer text-center"
              onClick={() => setActiveCol(activeCol === col ? null : col)}
            >
              {col}
              <div
                className={`absolute bottom-full left-1/2 z-50 mb-2 w-max -translate-x-1/2 whitespace-nowrap rounded border px-2 py-1 text-xs ${
                  isModal ? "border-tile-border bg-secondary text-text-primary" : "bg-gray-800 text-white"
                } ${activeCol === col ? "block" : "hidden group-hover:block"}`}
              >
                {columnTooltipMap[col]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={isModal ? "p-1.5" : ""}>
        {teams &&
          teams.length > 0 &&
          teams.map((team, i) => {
            const qualifierColor =
              i <= 1
                ? isModal
                  ? "border-accent/30 bg-accent/15 text-accent-soft"
                  : "bg-blue-800/40 text-white"
                : i === 2
                  ? isModal
                    ? "border-badge-success-border bg-badge-success-bg text-badge-success"
                    : "bg-green-800/40 text-white"
                  : "";
            return (
              <div
                className={`flex items-center justify-between px-2 py-1 ${
                  isModal ? "rounded-lg transition-colors hover:bg-white/[0.035]" : ""
                }`}
                key={team.name}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center text-[10px] font-bold ${
                      isModal ? "rounded-md border" : "rounded-sm p-1 text-xs"
                    } ${qualifierColor}`}
                  >
                    {i + 1}.
                  </span>
                  <button
                    className={
                      isModal
                        ? "truncate rounded px-1 text-left text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        : "rounded px-1 underline decoration-blue-400 underline-offset-4 transition-all duration-150 hover:bg-blue-900/10 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    }
                    onClick={() => navigate(`/csapatok/${team._id}`)}
                    tabIndex={0}
                    type="button"
                  >
                    {team.name}
                  </button>
                </div>
                <div
                  className={`flex items-center ${isModal ? "gap-2 text-[11px] font-semibold text-text-secondary" : "gap-4 text-sm"}`}
                >
                  {visibleColumns.map((col) => (
                    <div key={col} className="w-4 text-center">
                      {team[columnFieldMap[col]] as number}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GroupStandings;
