import { FaHeart } from "react-icons/fa";
import type { Match } from "@/models/match.type";
import type { User } from "@/models/user.type";
import { APP_CONFIG } from "@/config";
import { ImHeart } from "react-icons/im";
import useGame from "@/hooks/useGame";

interface FavoriteTeamBadgeProps {
  user?: User;
  match: Match;
  // "compact": egyszerű szív + zászló egymás mellett (desktop tábla)
  // "pill": díszesebb pasztell pillben, zászló a sarkára ültetett szívvel (mobil)
  variant?: "compact" | "pill";
}

const FavoriteTeamBadge = ({ user, match, variant = "compact" }: FavoriteTeamBadgeProps) => {
  const { getFavoriteTeam } = useGame();
  const team = getFavoriteTeam(user, match);
  if (!team) return null;

  const title = `Kedvenc csapata játszik: ${team.name}`;

  if (variant === "pill") {
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
              className="w-5 h-5 rounded-full object-cover ring-1 ring-rose-400/40"
            />
          ) : (
            <span className="w-5 h-5 rounded-full bg-rose-500/20" />
          )}
          <ImHeart
            className="absolute -bottom-0.5 -right-0.5 text-rose-500 bg-[#0e111b] rounded-full p-[1.5px]"
            size={13}
          />
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 shrink-0" title={title}>
      <FaHeart className="text-rose-400" size={12} />
      {team.flag && (
        <img
          src={`${APP_CONFIG.FLAG_PATH}${team.flag}`}
          alt={team.name}
          className="w-3.5 h-3.5 rounded-full object-cover"
        />
      )}
    </span>
  );
};

export default FavoriteTeamBadge;
