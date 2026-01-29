import type { FC } from "react";
import MatchListItem from "../MatchListItem";
import type { MatchesMobileViewProps } from "./types";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import { MatchStatus } from "@/utils/enums";

const MatchesMobileView: FC<MatchesMobileViewProps> = ({
  matchesWithBets,
  loading,
  error,
  onSelectMatch,
}) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader text="Mérkőzések betöltése..." />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (matchesWithBets.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">Még nincsenek mérkőzések erre a napra</div>
    );
  }

  return (
    <div>
      {matchesWithBets.map((match) => {
        return (
          <div
            key={match._id}
            className="px-1 mb-1 border-b border-gray-700/30 last:border-b-0 first:pt-0"
            onClick={() => {
              const canViewDetails = match?.status !== MatchStatus.enabled;
              if (canViewDetails) navigate(`/merkozesek/${match._id}`);
            }}
          >
            <MatchListItem
              match={match}
              displayTime
              displayStatusBadge
              onSelectMatch={onSelectMatch}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MatchesMobileView;
