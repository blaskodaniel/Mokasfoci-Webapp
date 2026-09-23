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
  selectedTab,
  disableTabs,
  hideTabbar = false,
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
            odds: outcomeBet?.odds,
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
      className="sm:w-[560px] bg-[image:var(--tile-bg-gradient)] sm:mx-3 sm:rounded-tile sm:border sm:border-tile-border sm:shadow-tile"
      onAfterClose={onAfterClose}
    >
      <MatchTeamsPanel match={match} />

      <div className="flex flex-col gap-2 px-4 pb-4">
        {/* TABS */}
        {!hideTabbar && (
          <div className="mb-2 flex w-full gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              disabled={disableTabs?.includes(CouponType.outcomeBet)}
              onClick={() => {
                if (disableTabs?.includes(CouponType.outcomeBet)) return;
                setActiveTab(CouponType.outcomeBet);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                activeTab === CouponType.outcomeBet
                  ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_4px_14px_-4px_rgba(107,75,255,0.6)]"
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              }`}
            >
              1 X 2
            </button>
            <button
              type="button"
              disabled={disableTabs?.includes(CouponType.scoreBet)}
              onClick={() => {
                if (disableTabs?.includes(CouponType.scoreBet)) return;
                setActiveTab(CouponType.scoreBet);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                activeTab === CouponType.scoreBet
                  ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_4px_14px_-4px_rgba(107,75,255,0.6)]"
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              }`}
            >
              Pontos eredmény
            </button>
          </div>
        )}

        {activeTab === CouponType.outcomeBet ? (
          <OutcomeBetModule
            match={match}
            onSave={onSaveOutcome}
            loading={isBettingPending}
            initBetValue={initBetValues?.outcomeBet?.betAmount}
            initSelectedOutcome={initBetValues?.outcomeBet?.outcome}
            initBetOdds={initBetValues?.outcomeBet?.odds}
            editMode={!!initBetValues?.outcomeBet?.betAmount}
          />
        ) : (
          <ScoreBetModule
            match={match}
            onSave={onSaveScore}
            loading={isBettingPending}
            initBetValue={initBetValues?.scoreBet?.betAmount}
            initTeamAScore={initBetValues?.scoreBet?.homeScore}
            initTeamBScore={initBetValues?.scoreBet?.awayScore}
            editMode={!!initBetValues?.scoreBet?.betAmount}
          />
        )}
      </div>
    </Modal>
  );
};

export default BetModal;
