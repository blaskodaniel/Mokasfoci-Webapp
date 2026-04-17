import { useMemo, useState, useEffect, type FC } from "react";
import Button from "../Button";
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

interface OutcomeBetModuleProps {
  match: Match;
  onSave: (betValue: number, selectedOutcome: MatchOutcome, editMode: boolean) => void;
  loading?: boolean;
  initBetValue?: number;
  initSelectedOutcome?: MatchOutcome;
  editMode?: boolean;
}

const OutcomeBetModule: FC<OutcomeBetModuleProps> = ({
  match,
  onSave,
  loading = false,
  initBetValue = 1000,
  initSelectedOutcome,
  editMode = false,
}) => {
  const { config } = useConfig();
  const { user: currentUser } = useAuth();
  const { userFavoriteTeam } = useGame();
  const [betValue, setBetValue] = useState<number>(initBetValue);
  const [selectedOutcome, setSelectedOutcome] = useState<MatchOutcome | null>(
    initSelectedOutcome || null
  );

  const teamStandingsQuery = useGetGroupStandingsById(String(match.teamA?.groupid ?? ""));

  const groupName = useMemo(() => {
    return teamStandingsQuery.data && teamStandingsQuery.data?.length > 0
      ? teamStandingsQuery.data[0].groupid.name
      : "";
  }, [teamStandingsQuery]);

  const groupId = useMemo(() => {
    return teamStandingsQuery.data && teamStandingsQuery.data?.length > 0
      ? teamStandingsQuery.data[0].groupid._id
      : "";
  }, [teamStandingsQuery]);

  const userScore = useMemo(() => {
    return currentUser ? currentUser.data.availableScore : 0;
  }, [currentUser]);

  const maxAllowedScore = useMemo(() => {
    return editMode ? userScore + initBetValue : userScore;
  }, [userScore, editMode, initBetValue]);

  useEffect(() => {
    if (!editMode && betValue > maxAllowedScore && maxAllowedScore > 0) {
      setBetValue(Math.max(100, Math.floor(maxAllowedScore / 100) * 100));
    }
  }, [maxAllowedScore, editMode, betValue]);

  const isValidBet = useMemo(
    () => betValue >= 100 && betValue <= maxAllowedScore && selectedOutcome !== null,
    [betValue, maxAllowedScore, selectedOutcome]
  );

  const subText = useMemo(() => {
    if (editMode) return "";
    if (userScore < 99) {
      return "Nincs elég pontod a fogadáshoz";
    }
    return `Felhasználható pontod: ${formatNumber(userScore)} pont`;
  }, [userScore, editMode]);

  const selectedOdds = useMemo(() => {
    if (selectedOutcome === MatchOutcome.home) return match.oddsAwin || 0;
    if (selectedOutcome === MatchOutcome.draw) return match.oddsDraw || 0;
    return match.oddsBwin || 0;
  }, [match.oddsAwin, match.oddsBwin, match.oddsDraw, selectedOutcome]);

  return (
    <>
      {userFavoriteTeam(match) && (
        <div className="text-center text-xs text-green-600">
          Kedvenc csapatod játszik! Minden odds-ra plusz {config?.favoritTeamFactor}x szorzó jár
        </div>
      )}

      <MatchOutcomeSelector
        selectedOutcome={selectedOutcome}
        onSelectOutcome={setSelectedOutcome}
        match={match}
        showDraw
      />

      <BetValueSelector betValue={betValue} onChangeBetValue={setBetValue} maxAllowedScore={maxAllowedScore} />

      {isValidBet && (
        <div className="flex justify-center items-center gap-2 mt-3">
          <div className="text-md">Várható nyereményed: </div>
          <div className="font-bold text-md text-green-500">
            {formatNumber(
              potentialWinnings(
                betValue,
                selectedOdds,
                userFavoriteTeam(match) ? config?.favoritTeamFactor : 1
              )
            )}
            <span className="pl-1 text-base font-normal text-gray-400">pont</span>
          </div>
        </div>
      )}

      {(match.type === MatchType.GroupStageRound1 ||
        match.type === MatchType.GroupStageRound2 ||
        match.type === MatchType.GroupStageRound3) && (
        <section className="flex justify-center pt-3">
          <GroupStandings
            teams={teamStandingsQuery.data ?? []}
            groupName={groupName}
            size="sm"
            groupId={groupId}
          />
        </section>
      )}

      {/* Mobile: Sticky button at bottom, Desktop: Regular button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-quaternary sm:relative sm:p-0 sm:bg-transparent sm:mt-6">
        <Button
          text={editMode ? "Mentés" : "LÉTREHOZÁS"}
          subText={subText}
          onClick={() => selectedOutcome && onSave(betValue, selectedOutcome, editMode)}
          className={`${
            editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } w-full py-3 sm:py-2`}
          disabled={!isValidBet || loading || (userScore < 99 && !editMode)}
          loading={loading}
        />
      </div>
    </>
  );
};

export default OutcomeBetModule;
