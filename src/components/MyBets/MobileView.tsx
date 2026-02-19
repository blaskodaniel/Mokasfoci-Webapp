import type { Bet } from "@/models/bet.type";
import { potentialWinnings } from "@/utils/common";
import { CouponStatus, CouponType, MatchOutcome, MatchStatus } from "@/utils/enums";
import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import { AnimatePresence } from "framer-motion";
import OutcomeBetCard from "./OutcomeBetCard";
import ScoreBetCard from "./ScoreBetCard";

interface MyBetsMobileViewProps {
  bets: Bet[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
}

const MyBetsMobileView = ({ bets, onEdit, onDelete }: MyBetsMobileViewProps) => {
  const { userFavoriteTeam } = useGame();
  const { config } = useConfig();
  if (!bets || bets.length === 0) {
    return <div className="text-center text-gray-400 py-8">Még nincsenek fogadásaid</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {bets.map((bet, index) => {
          const hasFavoriteTeam = userFavoriteTeam(bet.matchid);
          const favoritTeamFactor = hasFavoriteTeam ? config?.favoritTeamFactor : 1;
          const canViewDetails = bet.matchid?.status !== MatchStatus.enabled;
          const shouldShowPotentialWinnings =
            bet.status === CouponStatus.active ||
            (bet.status === CouponStatus.closed && bet.success);
          const winnings =
            bet.status === CouponStatus.active
              ? potentialWinnings(bet.amount, bet.odds, favoritTeamFactor)
              : bet.totalWin;
          const profit =
            bet.status === CouponStatus.closed && bet.success ? winnings - bet.amount : 0;
          const bgColor =
            bet.status === CouponStatus.active
              ? "bg-panel-bg"
              : bet.status === CouponStatus.closed && bet.success
                ? "bg-green-900/20"
                : "bg-red-900/20";

          const outcomeText =
            bet.outcome === MatchOutcome.home
              ? bet?.matchid?.teamA?.name
              : bet.outcome === MatchOutcome.away
                ? bet?.matchid?.teamB?.name
                : "Döntetlen";

          const outcomeFlag =
            bet.outcome === MatchOutcome.home
              ? bet?.matchid?.teamA?.flag
              : bet.outcome === MatchOutcome.away
                ? bet?.matchid?.teamB?.flag
                : null;

          if (bet.type === CouponType.outcomeBet)
            return (
              <OutcomeBetCard
                key={bet._id}
                bet={bet}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                hasFavoriteTeam={hasFavoriteTeam}
                bgColor={bgColor}
                canViewDetails={canViewDetails}
                shouldShowPotentialWinnings={shouldShowPotentialWinnings}
                winnings={winnings}
                profit={profit}
                outcomeText={outcomeText}
                outcomeFlag={outcomeFlag}
              />
            );
          if (bet.type === CouponType.scoreBet)
            return (
              <ScoreBetCard
                key={bet._id}
                bet={bet}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                hasFavoriteTeam={hasFavoriteTeam}
                bgColor={bgColor}
                canViewDetails={canViewDetails}
              />
            );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MyBetsMobileView;
