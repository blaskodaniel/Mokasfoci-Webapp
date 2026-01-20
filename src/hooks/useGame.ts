import type { Match } from "@/models/match.type";
import { useAppSelector } from "@/state/hooks";
import { useCallback } from "react";

const useGame = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  const userFavoriteTeam = useCallback(
    (match: Match) => {
      if (currentUser?.data.teamid?.toString() === match.teamA?._id.toString()) return match.teamA;
      if (currentUser?.data.teamid?.toString() === match.teamB?._id.toString()) return match.teamB;
      return;
    },
    [currentUser?.data?.teamid]
  );

  return {
    userFavoriteTeam,
  };
};

export default useGame;
