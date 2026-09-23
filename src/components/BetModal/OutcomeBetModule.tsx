import { useMemo, useState, useEffect, type FC } from "react";
import Button from "../Button";
import ConfirmModal from "../ConfirmModal";
import { MatchOutcome, MatchType } from "@/utils/enums";
import useGame from "@/hooks/useGame";
import { useConfig } from "@/hooks/useConfig";
import { formatNumber, potentialWinnings } from "@/utils/common";
import MatchOutcomeSelector from "./MatchOutcomeSelector";
import BetValueSelector from "./BetValueSelector";
import GroupStandings from "../Widgets/GroupStandings";
import { useGetGroupStandingsById } from "@/hooks/api/useTeams";
import type { Match } from "@/models/match.type";
import { useAuth } from "@/hooks/useAuth";
import { IoStar } from "react-icons/io5";

const MIN_BET = 100; // lépésköz: a tét 100-asra kerekítődik
const MIN_VALID_BET = 200; // minimum érvényes (leadható) tét

const GROUP_STAGE_TYPES = new Set([
  MatchType.GroupStageRound1,
  MatchType.GroupStageRound2,
  MatchType.GroupStageRound3,
]);

interface OutcomeBetModuleProps {
  match: Match;
  onSave: (betValue: number, selectedOutcome: MatchOutcome, editMode: boolean) => void;
  loading?: boolean;
  initBetValue?: number;
  initSelectedOutcome?: MatchOutcome;
  initBetOdds?: number;
  editMode?: boolean;
}

const OutcomeBetModule: FC<OutcomeBetModuleProps> = ({
  match,
  onSave,
  loading = false,
  initBetValue = 1000,
  initSelectedOutcome,
  initBetOdds,
  editMode = false,
}) => {
  const { config } = useConfig();
  const { user: currentUser } = useAuth();
  const { userFavoriteTeam } = useGame();
  const [betValue, setBetValue] = useState<number>(initBetValue);
  const [selectedOutcome, setSelectedOutcome] = useState<MatchOutcome | null>(
    initSelectedOutcome ?? null
  );
  const [isOddsConfirmOpen, setIsOddsConfirmOpen] = useState(false);

  const isExistAllOdds = !!(match.oddsAwin && match.oddsBwin && match.oddsDraw);
  const isGroupStageMatch = GROUP_STAGE_TYPES.has(match.type);
  const isFavoriteTeam = useMemo(() => userFavoriteTeam(match), [userFavoriteTeam, match]);
  const teamStandingsQuery = useGetGroupStandingsById(String(match.teamA?.groupid ?? ""));

  const groupStandings = useMemo(() => {
    const first = teamStandingsQuery.data?.[0];
    return first ? { name: first.groupid.name, id: first.groupid._id } : null;
  }, [teamStandingsQuery.data]);

  const userScore = currentUser?.data.availableScore ?? 0;
  const maxAllowedScore = editMode ? userScore + initBetValue : userScore;

  useEffect(() => {
    if (!editMode && betValue > maxAllowedScore && maxAllowedScore > 0) {
      setBetValue(Math.max(MIN_BET, Math.floor(maxAllowedScore / MIN_BET) * MIN_BET));
    }
  }, [maxAllowedScore, editMode, betValue]);

  const isValidBet =
    betValue >= MIN_VALID_BET &&
    betValue <= maxAllowedScore &&
    selectedOutcome !== null &&
    isExistAllOdds;

  const subText = useMemo(() => {
    if (editMode) return "";
    if (userScore < 99) return "Nincs elég pontod a fogadáshoz";
    return `Felhasználható pontod: ${formatNumber(userScore)} pont`;
  }, [userScore, editMode]);

  const selectedOdds = useMemo(() => {
    if (selectedOutcome === MatchOutcome.home) return match.oddsAwin ?? 0;
    if (selectedOutcome === MatchOutcome.draw) return match.oddsDraw ?? 0;
    return match.oddsBwin ?? 0;
  }, [match.oddsAwin, match.oddsBwin, match.oddsDraw, selectedOutcome]);

  return (
    <>
      {isFavoriteTeam && (
        <div className="mb-3 flex items-center justify-center gap-1.5 rounded-full border border-badge-amber-border bg-badge-amber-bg px-3 py-1.5 text-center text-xs font-semibold text-badge-amber">
          <IoStar size={12} />
          Kedvenc csapatod játszik! Minden odds-ra +{config?.favoritTeamFactor}x szorzó jár
        </div>
      )}

      <MatchOutcomeSelector
        selectedOutcome={selectedOutcome}
        onSelectOutcome={setSelectedOutcome}
        match={match}
        showDraw
        existingOutcome={initSelectedOutcome}
        existingOdds={initBetOdds}
      />

      <BetValueSelector
        betValue={betValue}
        onChangeBetValue={setBetValue}
        maxAllowedScore={maxAllowedScore}
      />

      {isValidBet && (
        <div className="mt-4 flex items-center justify-between rounded-tile border border-tile-border bg-white/5 px-4 py-3">
          <span className="text-sm text-text-secondary">Várható nyereményed</span>
          <span className="text-lg font-black text-badge-success">
            {formatNumber(
              potentialWinnings(
                betValue,
                selectedOdds,
                isFavoriteTeam ? config?.favoritTeamFactor : 1
              )
            )}
            <span className="pl-1 text-xs font-normal text-text-muted">pont</span>
          </span>
        </div>
      )}

      {isGroupStageMatch && groupStandings && (
        <section className="flex justify-center pt-3">
          <GroupStandings
            teams={teamStandingsQuery.data ?? []}
            groupName={groupStandings.name}
            size="sm"
            groupId={groupStandings.id}
            variant="modal"
          />
        </section>
      )}

      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-tile-border bg-[image:var(--tile-bg-gradient)] px-4 py-3">
        <Button
          text={editMode ? "Mentés" : "Fogadás létrehozása"}
          subText={subText}
          variant="cta"
          onClick={() => {
            if (!selectedOutcome) return;
            const oddsGotWorse =
              editMode &&
              initBetOdds != null &&
              selectedOutcome === initSelectedOutcome &&
              selectedOdds < initBetOdds;
            if (oddsGotWorse) {
              setIsOddsConfirmOpen(true);
            } else {
              onSave(betValue, selectedOutcome, editMode);
            }
          }}
          className="w-full"
          disabled={!isValidBet || loading || (userScore < 99 && !editMode)}
          loading={loading}
        />
      </div>

      <ConfirmModal
        isOpen={isOddsConfirmOpen}
        title="Odds változtatás"
        description={`Biztosan lecseréled a ${initBetOdds?.toFixed(2)} odds-ot → ${selectedOdds.toFixed(2)}-ra?`}
        onConfirm={() => {
          setIsOddsConfirmOpen(false);
          if (selectedOutcome) onSave(betValue, selectedOutcome, editMode);
        }}
        onCancel={() => setIsOddsConfirmOpen(false)}
        confirmClassName="bg-badge-amber text-primary hover:brightness-110"
      />
    </>
  );
};

export default OutcomeBetModule;
