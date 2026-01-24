import { useClickOutside } from "@/hooks/useClickOutside";
import type { Team } from "@/models/team.type";
import { useRef, useState, type FC } from "react";

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
  teams?: Team[];
  columns?: ColumnKey[];
  size?: "sm" | "md" | "lg";
}

const GroupStandings: FC<GroupStandingsProps> = ({
  groupName,
  teams,
  columns = Object.keys(columnFieldMap) as ColumnKey[],
  size = "md",
}) => {
  const [activeCol, setActiveCol] = useState<ColumnKey | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  useClickOutside(headerRef, () => setActiveCol(null));

  const className = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";
  return (
    <div
      className={`p-2 w-full bg-black/50 backdrop-blur-md 
    rounded-xl shadow-lg text-white backdrop-filter bg-opacity-0 ${className}`}
    >
      <div
        className="rounded-xl px-2 py-1 flex justify-between items-center
       bg-[#06923edb] backdrop-blur-md font-bold"
      >
        <div className="truncate ">{groupName} csoport</div>
        <div className="flex items-center gap-4 text-sm" ref={headerRef}>
          {columns
            ? columns.map((col) => (
                <div
                  key={col}
                  className="w-4 text-center group relative cursor-pointer"
                  onClick={() => setActiveCol(activeCol === col ? null : col)}
                >
                  {col}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap ${
                    activeCol === col ? "block" : "hidden group-hover:block"
                  }`}>
                    {columnTooltipMap[col]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              ))
            : (Object.keys(columnFieldMap) as ColumnKey[]).map((col) => (
                <div
                  key={col}
                  className="w-4 text-center group relative cursor-pointer"
                  onClick={() => setActiveCol(activeCol === col ? null : col)}
                >
                  {col}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap ${
                    activeCol === col ? "block" : "hidden group-hover:block"
                  }`}>
                    {columnTooltipMap[col]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div>
        {teams &&
          teams.length > 0 &&
          teams.map((team, i) => {
            const qualifierColor =
              i <= 1 ? "bg-blue-600 text-white" : i === 2 ? "bg-green-600 text-white" : "";
            return (
              <div className={`flex justify-between items-center px-2 py-1`} key={team.name}>
                <div className="truncate flex items-center gap-2">
                  <span className={`rounded-sm text-center text-xs ${qualifierColor} p-1`}>
                    {i + 1}.
                  </span>{" "}
                  <span className="pt-0.5">{team.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {(columns ? columns : (Object.keys(columnFieldMap) as ColumnKey[])).map((col) => (
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
