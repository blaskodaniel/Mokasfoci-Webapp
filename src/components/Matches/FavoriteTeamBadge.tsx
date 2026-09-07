import { IoStar } from "react-icons/io5";
import type { Match } from "@/models/match.type";
import type { User } from "@/models/user.type";
import type { Team } from "@/models/team.type";
import { APP_CONFIG } from "@/config";
import useGame from "@/hooks/useGame";

interface FavoriteTeamBadgeProps {
  user?: User;
  match?: Match;
  // Ha a hívó már ismeri a kedvenc csapatot (pl. useGame().userFavoriteTeam eredménye),
  // átadható közvetlenül is – ekkor nincs szükség user+match kombóra.
  team?: Team | null;
  // "pill": zászló, a sarkára ültetett glow-os csillaggal (ahol még nincs zászló megjelenítve)
  // "star": csak a csillag, hogy egy már megjelenő zászló alá/mellé lehessen pozícionálni
  variant?: "pill" | "star";
  className?: string;
}

const FavoriteTeamBadge = ({
  user,
  match,
  team: teamProp,
  variant = "pill",
  className = "",
}: FavoriteTeamBadgeProps) => {
  const { getFavoriteTeam } = useGame();
  const team = teamProp !== undefined ? teamProp : match ? getFavoriteTeam(user, match) : undefined;
  if (!team) return null;

  const title = `Kedvenc csapatod játszik: ${team.name}`;

  if (variant === "star") {
    return (
      <IoStar
        className={`text-badge-amber drop-shadow-[0_0_4px_rgba(245,165,36,0.75)] ${className}`}
        size={12}
        title={title}
      />
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full shrink-0"
      title={title}
    >
      <span className="relative inline-flex shrink-0">
        {team.flag ? (
          <img
            src={`${APP_CONFIG.FLAG_PATH}${team.flag}`}
            alt={team.name}
            className="w-5 h-5 rounded-full object-cover ring-2 ring-badge-amber/50"
          />
        ) : (
          <span className="w-5 h-5 rounded-full bg-badge-amber-bg" />
        )}
        <IoStar
          className="absolute -bottom-1 -right-1 text-badge-amber bg-[#0e111b] rounded-full p-[2px]
            drop-shadow-[0_0_4px_rgba(245,165,36,0.75)]"
          size={14}
        />
      </span>
    </span>
  );
};

export default FavoriteTeamBadge;
