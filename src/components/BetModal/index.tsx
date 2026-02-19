import { useMemo, useState, type FC } from "react";
import Modal from "../Modal";
import type { BetModalProps } from "./types";
import MatchTeamsPanel from "./MatchTeamsPanel";
import OutcomeBetModule from "./OutcomeBetModule";
import { CouponType, MatchOutcome } from "@/utils/enums";
import ScoreBetModule from "./ScoreBetModule";
import { useBetting } from "@/hooks/useBetting";

const BetModal: FC<BetModalProps> = ({
  isOpen,
  onClose,
  onAfterSave,
  match,
  bets = [],
  editMode = false,
  selectedTab,
  disableTabs,
  onAfterClose,
}) => {
  const [activeTab, setActiveTab] = useState<CouponType>(selectedTab || CouponType.outcomeBet);
  const {
    onSubmitOutcomeCoupon: submitOutcomeBet,
    onSubmitScoreCoupon: submitScoreBet,
    isPending: isBettingPending,
  } = useBetting();

  const onSaveOutcome = (betAmount: number, outcome: MatchOutcome, editMode: boolean) => {
    if (!match) return;

    submitOutcomeBet(match, betAmount, outcome, () => onAfterSave?.(betAmount, outcome, editMode));
  };

  const onSaveScore = (
    betAmount: number,
    homeScore: number,
    awayScore: number,
    editMode: boolean
  ) => {
    if (!match) return;

    submitScoreBet(match, betAmount, homeScore, awayScore, () =>
      onAfterSave?.(betAmount, MatchOutcome.home, editMode)
    );
  };

  const initBetValues = useMemo(() => {
    let outcomeBet;
    let scoreBet;
    if (bets.length > 0) {
      const bet = bets.filter((b) => b.matchid._id === match._id);
      if (bet?.length > 0) {
        outcomeBet = bet.find((b) => b.type === CouponType.outcomeBet);
        scoreBet = bet.find((b) => b.type === CouponType.scoreBet);
        return {
          outcomeBet: {
            betAmount: outcomeBet?.amount,
            outcome: outcomeBet?.outcome,
          },
          scoreBet: {
            betAmount: scoreBet?.amount,
            homeScore: scoreBet?.scoreTeamA,
            awayScore: scoreBet?.scoreTeamB,
          },
        };
      }
    }
  }, [bets, match]);

  if (!match) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Fogadás módosítása" : "Fogadás létrehozása"}
      className="sm:w-[455px] bg-primary px-4 py-3 sm:mx-3"
      onAfterClose={onAfterClose}
    >
      <div className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none">
        {/* TABS */}
        <div className="flex w-full mb-4 bg-tertiary rounded-lg p-1">
          <button
            onClick={() => {
              if (disableTabs?.includes(CouponType.outcomeBet)) return;
              setActiveTab(CouponType.outcomeBet);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === CouponType.outcomeBet
                ? "bg-primary text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            1 X 2
          </button>
          <button
            onClick={() => {
              if (disableTabs?.includes(CouponType.scoreBet)) return;
              setActiveTab(CouponType.scoreBet);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === CouponType.scoreBet
                ? "bg-primary text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pontos eredmény 🚧
          </button>
        </div>

        <MatchTeamsPanel match={match} />

        {activeTab === CouponType.outcomeBet ? (
          <OutcomeBetModule
            match={match}
            onSave={onSaveOutcome}
            loading={isBettingPending}
            initBetValue={initBetValues?.outcomeBet?.betAmount}
            initSelectedOutcome={initBetValues?.outcomeBet?.outcome}
            editMode={editMode}
          />
        ) : (
          <ScoreBetModule
            match={match}
            onSave={onSaveScore}
            loading={isBettingPending}
            initBetValue={initBetValues?.scoreBet?.betAmount}
            initTeamAScore={initBetValues?.scoreBet?.homeScore}
            initTeamBScore={initBetValues?.scoreBet?.awayScore}
            editMode={editMode}
          />
        )}
      </div>
    </Modal>
  );
};

export default BetModal;
