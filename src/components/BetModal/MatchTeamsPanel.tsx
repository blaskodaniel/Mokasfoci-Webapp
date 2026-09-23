import { APP_CONFIG } from "@/config";
import useGame from "@/hooks/useGame";
import type { Match } from "@/models/match.type";
import type { Team } from "@/models/team.type";
import { getMatchTypeText } from "@/utils/common";
import { format } from "date-fns";
import type { FC } from "react";
import { IoStar } from "react-icons/io5";
import UnknownFlag from "../UnknownFlag";

interface MatchTeamsPanelProps {
  match: Match;
}

interface TeamColumnProps {
  team?: Team;
  placeholder?: string;
  isFavorite: boolean;
}

const TeamColumn: FC<TeamColumnProps> = ({ team, placeholder, isFavorite }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 min-w-0">
    <div className="relative">
      {team?.flag ? (
        <img
          src={`${APP_CONFIG.FLAG_PATH}${team.flag}`}
          alt={`${team.name} flag`}
          className="h-16 w-16 rounded-full border border-white/10 object-cover shadow-[0_0_20px_-4px_rgba(0,0,0,0.6)]"
        />
      ) : (
        <UnknownFlag size={16} />
      )}
      {isFavorite && (
        <IoStar
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#0e111b] p-[3px] text-badge-amber
            drop-shadow-[0_0_5px_rgba(245,165,36,0.75)]"
        />
      )}
    </div>
    <span className="max-w-full truncate text-center text-sm font-bold text-white sm:text-base">
      {team?.name || placeholder || ""}
    </span>
  </div>
);

const MatchTeamsPanel: FC<MatchTeamsPanelProps> = ({ match }) => {
  const { userFavoriteTeam } = useGame();
  const favoriteTeam = userFavoriteTeam(match);

  return (
    <div className="relative overflow-hidden px-4 pt-6 pb-5">
      <div className="pointer-events-none absolute -top-14 left-1/2 h-36 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative mb-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {getMatchTypeText(match.type)}
        {match.date && (
          <>
            <span className="opacity-50">·</span>
            {format(new Date(match.date), "MMM dd, HH:mm")}
          </>
        )}
      </div>

      <div className="relative flex items-center justify-between gap-2">
        <TeamColumn
          team={match.teamA}
          placeholder={match.teamAPlaceholder}
          isFavorite={!!favoriteTeam && favoriteTeam._id === match.teamA?._id}
        />
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-cta)]
            text-[11px] font-black text-white shadow-[0_0_14px_-3px_rgba(107,75,255,0.7)]"
        >
          VS
        </div>
        <TeamColumn
          team={match.teamB}
          placeholder={match.teamBPlaceholder}
          isFavorite={!!favoriteTeam && favoriteTeam._id === match.teamB?._id}
        />
      </div>
    </div>
  );
};

export default MatchTeamsPanel;
