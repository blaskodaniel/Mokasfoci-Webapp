import { APP_CONFIG } from "@/config";
import useGame from "@/hooks/useGame";
import type { Match } from "@/models/match.type";
import type { FC } from "react";
import { MdFavorite } from "react-icons/md";

interface MatchTeamsPanelProps {
  match: Match;
}

const MatchTeamsPanel: FC<MatchTeamsPanelProps> = ({ match }) => {
  const { userFavoriteTeam } = useGame();
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="relative">
          {match.teamA?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
              alt={`${match.teamA.name} flag`}
              className="w-12 h-12 object-cover rounded-full"
            />
          )}
          {userFavoriteTeam(match)?._id === match.teamA?._id && (
            <MdFavorite className="absolute -top-1 -right-1 text-red-500 w-5 h-5 drop-shadow-md" />
          )}
        </div>
        <span className="text-lg">{match.teamA?.name}</span>
      </div>
      <div>vs.</div>
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="relative">
          {match.teamB?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
              alt={`${match.teamB.name} flag`}
              className="w-12 h-12 object-cover rounded-full"
            />
          )}
          {userFavoriteTeam(match)?._id === match.teamB?._id && (
            <MdFavorite className="absolute -top-1 -right-1 text-red-500 w-5 h-5 drop-shadow-md" />
          )}
        </div>
        <span className="text-lg">{match.teamB?.name}</span>
      </div>
    </div>
  );
};

export default MatchTeamsPanel;
